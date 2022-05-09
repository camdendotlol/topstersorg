# Topsters.org

A website for creating charts with books, music, and games.

![screenshot of the app](/screenshot.png)

## Roadmap

The post-release roadmap is tracked [here](https://github.com/mythmakerseven/topstersorg/issues/4).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Portfolio Reflection

(Note: This site is now in production use with real users. I plan to write a post on my blog where I talk about my experience running a site that people actually use. That blog post will eventually replace the below text.)

I just noticed I haven't written one of these for Topsters 3. Oops. Here we go.

Topsters 3 wasn't my first experience with [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), (that would be [Chromapoll's OpenGraph previews](https://camdenmecklem.com/blog/opengraph_without_ssr)) but it was my first really substantial experience of digging deep into it. Topsters 3 uses a lot of fancy logic to put grid items in their proper places, move them around, and detect whether the user's mouse is hovering over an interactable chart item or not. It was a huge challenge, to put it blunty, but I pushed through and the end result is what I envisioned when I started.

The challenge that cost the most time was the ["tainted canvas"](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image) restriction on canvases containing foreign images. I had planned to just add a button to download the canvas as a PNG file, but the websites hosting the book/music/game cover art do not allow CORS cross-origin requests. This limitation only applies to direct download, not `<img>` tags, so I could still generate the chart on the frontend and the user can manually download via right-click. But for a convenient download button, I needed to generate the chart again on the backend and send it to the frontend.

To avoid duplicating code, I split the chart generation code into [topster](https://www.npmjs.com/package/topster) and published it. This has the added benefit of allowing other people to build their own projects with it, and the code is generic enough that you can put anything on the grid as long as it has an image and a name.

topsters.org is also my very first Vue app. I have mixed feelings about Vue--in very broad terms, this experience reminded me of descriptions I've seen of Ruby on Rails's ["Golden Path"](https://steveklabnik.com/writing/rails-has-two-default-stacks), where certain things are made particularly easy at the expense of making other things harder. There are definitely some use-cases, like simply inserting a value into the page, that Vue makes simple and easy compared to React. But other times I felt like I was going against Vue's Golden Path, particularly with TypeScript integration, which is sort of half-supported. It's also pretty rough around the edges. The `defineComponent` API takes several possible values, such as `data`, `method`, `computed`, etc., and each one requires 1) a function, 2) an object, or 3) an array. Which one uses which is difficult to remember and feels random (and is difficult to look up, because Vue offers at least two slightly different APIs). I'm sure there's a very good technical reason for each choice behind the scenes, but as an "end-user" the design feels half-baked. The Vue development tools extension seems to be broken with Vue 3, which made debugging a lot harder. Vue is stuck in limbo between Vue 2 and Vue 3, and if you're browsing the docs for Vue 2 (which are provided by default instead of the new ones) and need to switch to Vue 3, it redirects to the documentation homepage instead of Vue 3 version of the page you were looking at. There were a lot more of these small annoyances, many more of which I don't remember now, but they really added up to make everything vaguely frustrating in a way that I've never experienced with React.

In summary, I will consider Vue for small, lightweight web apps but stick to React, which feels more generic and less opinionated, for major projects. There is definitely value in Vue--as long as you stay on its Golden Path--and the bundle download size is a lot smaller than React, at least for real-world projects with a bunch of dependencies. It also has the benefit of being the one major framework not tied to a major corporation, although I don't know if the BDFL model is all that better.
