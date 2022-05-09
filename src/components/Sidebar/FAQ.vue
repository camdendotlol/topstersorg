<template>
  <div id="faq">
    <div class="container">
      <h2>Why did you make this site?</h2>
      <p>I wanted to add a project to my portfolio, and a topster site was one of several ideas I kicked around for a while. I finally got around to it one night. Just a couple hours after I sat down to start coding, the creator of another well-known topster site added a link to a sketchy website, which made a lot of people start looking for an alternative. That coincidence certainly pushed me to commit to finishing Topsters.org, but it was only a coincidence. My decision to create this site was personal interest and not a response to anything.</p>
      <h2>Why is book searching slow, why does it sometimes not work, why is it missing a book, etc.?</h2>
      <p>I'm using OpenLibrary, which is affiliated with the Internet Archive and runs on donations. The music and games APIs are both from companies that can afford top-tier reliability. But OpenLibrary is a bit less reliable. Don't judge them too much for it, and maybe <a href="https://archive.org/donate/?platform=ol&origin=olwww-TopNavDonateButton">donate to them</a> to help them improve their services.</p>
      <h2>How can I make my own topster site or similar project?</h2>
      <p>If you're a developer, you might be interested in the <a href="https://www.npmjs.com/package/topster">JavaScript library I made</a>. Topsters 3 uses this to generate charts, and your project can too.</p>
      <h2>Why is my favorite album/book/game not in the results?</h2>
      <p>Not everything in the databases has cover art attached. Because charts require cover art, Topsters 3 filters out items that are missing it. For example, occasionally a band decides they don't want their cover art to appear in databases anymore, so they file a copyright takedown. You may have seen this happen on other sites such as Rate Your Music. This is very rare but it can affect popular items--as of this writing, all of King Crimson's releases are missing album art on Last.fm and as a result will not appear in search results.</p>
      <h2>Why is Topsters.org so laggy?</h2>
      <p>This is a Firefox issue :(</p>
      <p>I wish I could fix it, and there are a few performance optimizations I can make in the future, but the bottom line is that Firefox does a bad job of supporting the browser technology I used to build this site. Chart rendering uses a something called <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas">Canvas</a>, which is a nifty modern way to render graphics in the browser. But Firefox is really behind on optimizing their version of Canvas, so it gets terrible performance. The feature that slows down Firefox the most is text shadows. If you're on Firefox, you might get more usable performance if you disable the "show titles" option.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({

})
</script>

<style scoped>
#faq {
  display: flex;
  background: #72bcd4;
  margin-top: 0;
  padding: 0;
  border-radius: 0 0 5px 5px;
  text-align: left;
  overflow-y: scroll;
  height: 500px;
}

.container {
  width: 100%;
  margin: auto 10px;
}

h2 {
  font-size: 1.2rem;
}

</style>
