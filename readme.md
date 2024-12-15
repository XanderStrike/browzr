# Browzr

_down with the heirarchy_

Unlike other file browsers, this one blatantly disregards your meticulous file
structure and lets you search the whole dang thing really fast. This way when
you know what you're looking for, you can just get it instead of having to tap
through annoying menus.

If you're the kind of person who prefers Search over Navigation, then this might
be the file browser for you.

[Live Demo](https://browzr.astandke.com)

<img width="1185" alt="image" src="https://github.com/user-attachments/assets/a81e421a-3094-472b-a4b4-1cf6c78bcfc1" />


## Installation

Run this with docker:

```
docker run -v <path>:/app/files:ro -u $(id -u ${USER}):$(id -g ${USER}) -p 3000:3000 xanderstrike/browzr
```

A nice copy-pastable command run it against the current dir:

```
docker run -v $(pwd):/app/files:ro -u $(id -u ${USER}):$(id -g ${USER}) -p 3000:3000 xanderstrike/browzr
```

## Performance

I currently use it for browsing a 120,000 file ROM archive, and my experience is
great. The page is loaded and ready to search in a second or two, and results
similarly come up in a second or two. This is good enough for my uses.

## Contributing

Please do, PRs appreciated.

## License

MIT
