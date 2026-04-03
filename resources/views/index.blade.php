<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Laravel React TS</title>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
    <link
        href="https://fonts.googleapis.com/css2?family=Courgette&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
        rel="stylesheet"
    />
    @viteReactRefresh
</head>

<body>
    <noscript>
        <strong
            >We're sorry but this application doesn't work properly without JavaScript enabled.
            Please enable it to continue.</strong
        >
    </noscript>
    @vite ('resources/react/index.tsx')
</body>
</html>
