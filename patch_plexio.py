with open('/app/plexio/routers/addon.py', 'r') as f:
    content = f.read()
target = \"name=f'{section.title} | {configuration.server_name}'\"
replacement = \"name=f'{configuration.server_name} | {section.title}'\"
if target in content:
    with open('/app/plexio/routers/addon.py', 'w') as f:
        f.write(content.replace(target, replacement))
    print('Plexio patched successfully')
else:
    print('Target not found or already patched')
