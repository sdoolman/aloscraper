# AloMoves Downloader

AloMoves Downloader is a Python tool that automates the process of downloading video files from the [AloMoves](https://ww.alomoves.com) website. This tool uses Selenium to navigate the site and ffmpeg to download the videos.

## Features

- **Automated Web Browsing**: Uses Selenium to log in and navigate AloMoves.
- **Video Downloading**: Utilizes ffmpeg to download video files from provided URLs.
- **Command-Line Interface**: Accepts username and password via the CLI for secure authentication.

## Requirements

- Python 3.7+
- Selenium
- ffmpeg
- tqdm

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/alomoves-downloader.git
    cd alomoves-downloader
    ```

2. Create and activate a virtual environment (optional but recommended):
    ```sh
    python -m venv venv
    source venv/bin/activate   # On Windows use `venv\Scripts\activate`
    ```

3. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

4. Install [ffmpeg](https://ffmpeg.org/download.html) and ensure it's available in your PATH.

## Usage

1. Create a `downloadlinks.txt` file containing the URLs of the videos you want to download, each on a new line.

2. Run the downloader:
    ```sh
    python downloader.py
    ```

3. You will be prompted to enter your AloMoves username and password.

4. The downloaded files will be saved in the specified directory.

## Command-Line Interface

The script accepts username and password as input via the command line for secure authentication.

Example usage:
```sh
python downloader.py
```
You will then be prompted to enter your username and password.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/fooBar`).
3. Commit your changes (`git commit -am 'Add some fooBar'`).
4. Push to the branch (`git push origin feature/fooBar`).
5. Create a new Pull Request.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Selenium](https://www.selenium.dev/)
- [ffmpeg](https://ffmpeg.org/)
