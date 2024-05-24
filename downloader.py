import getpass
import json
import socket

from ffmpeg import FFmpeg, Progress
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sys import stdout
from tqdm import tqdm
from typing import Dict

socket.setdefaulttimeout(10)
email = input('Enter Email: ').strip()
password = getpass.getpass(prompt='Enter Password: ').strip()
assert email and password

desired_capabilities = DesiredCapabilities.CHROME
desired_capabilities["goog:loggingPrefs"] = {"performance": "ALL"}

options = webdriver.ChromeOptions()

options.add_argument("--no-sandbox")
options.add_argument("--headless")
options.add_argument('--disable-dev-shm-usage')
options.add_argument("start-maximized")
options.add_argument("--autoplay-policy=no-user-gesture-required")
options.add_argument("disable-infobars")
options.add_argument("--disable-extensions")
options.add_argument("--ignore-certificate-errors")
options.add_argument("--mute-audio")
options.add_argument("--disable-notifications")
options.add_argument("--disable-popup-blocking")
options.add_argument(f'user-agent={desired_capabilities}')

browser = webdriver.Chrome(
    options=options
)

links_file = Path.cwd() /'downloadlinks.txt'
lines = links_file.read_text().splitlines()


class DownloadProgressBar(tqdm):
    def update_to(self, b=1, bsize=1, tsize=None):
        if tsize is not None:
            self.total = tsize
        self.update(b * bsize - self.n)


def download(title, url):
    file_path = Path(title).with_suffix('.mp4')
    if file_path.is_file():
        print(f'File [{file_path}] already exists, skipping...')
        return

    print(f'Downloading [{file_path}]...')
    ffmpeg = (
        FFmpeg()
        .input(url)
        .output(file_path, vcodec="copy")
    )

    @ffmpeg.on("progress")
    def on_progress(progress: Progress):
        stdout.write(f'Downloaded [{progress.size}] bytes.')
        stdout.write('\r')

    @ffmpeg.on("completed")
    def on_completed():
        print("Completed!")

    ffmpeg.execute()
    return

            
def do_login(email, password):
    browser.get("https://www.alomoves.com/signin")
    current_url = browser.current_url

    mailfield = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[contains(@name,'email')]"))
    )

    pwfield = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[contains(@name,'password')]"))
    )

    mailfield.send_keys(email)
    mailfield.send_keys(Keys.TAB)
    pwfield.send_keys(password)

    pwfield.send_keys(Keys.ENTER)

    WebDriverWait(browser, 10).until(
       lambda driver: driver.current_url != current_url
    )


def collect_videos_for_course(courselink) -> Dict:
    print(f'Grabbing lessons for [{courselink}].')
    browser.get(courselink)
    try:
        workoutLinks = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@class,'workout-title')]/a"))
        )
        last_lesson = workoutLinks[-1] 
        lesson_link = last_lesson.get_attribute('href')  # the last lesson contains all the video links
    except Exception as e:
        print(f'Could not find lessons. Error: [{e}].')
        return

    print(f'Grabbing videos from lesson [{lesson_link}].')
    browser.get(lesson_link)
    try:
        element = WebDriverWait(browser, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div[origin]'))
        )
        origin = element.get_attribute('origin')
        origin = json.loads(origin)
        entries = origin['entries']
        return {
            entry['title'].upper(): entry['video']['hls'].split('?token=')[0] for entry in entries
        }
    except Exception as e:
        print(f'Failed to grab videos. Error: [{e}].')
        return

def main():
    do_login(email, password)
    print(f'Found {len(lines)} courses to scrape.')
    for line in lines:
        videos_links = collect_videos_for_course(line)
        print(f'Found {len(videos_links)} videos to download.')
        for i, title in enumerate(videos_links, start=1):
            print(f'Downloading video {i}/{len(videos_links)}')
            download(title, videos_links[title])

    browser.quit()
    print('All downloads completed, have fun!')

main()