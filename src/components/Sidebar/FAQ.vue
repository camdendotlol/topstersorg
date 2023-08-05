<template>
  <div id="faq">
    <div class="container">
      <h2>Why can't I find any King Crimson albums?</h2>
      <p>Not everything in the databases has cover art attached. Because charts require cover art, Topsters 3 filters out items that are missing it. For example, occasionally a band decides they don't want their cover art to appear in databases anymore, so they file a copyright takedown. You may have seen this happen on other sites such as Rate Your Music. This is very rare but it can affect popular items--as of this writing, all of King Crimson's releases are missing album art on Last.fm and as a result will not appear in search results.</p>
      <h2>Why is book searching slow, why does it sometimes not work, why is it missing a book, etc.?</h2>
      <p>I'm using OpenLibrary, which is affiliated with the Internet Archive and runs on donations. The music and games APIs are both from companies that can afford top-tier reliability. But OpenLibrary is a bit less reliable. Don't judge them too much for it, and maybe <a href="https://archive.org/donate/?platform=ol&origin=olwww-TopNavDonateButton">donate to them</a> to help them improve their services.</p>
      <h2>How can I make my own topster site or similar project?</h2>
      <p>If you're a developer, you might be interested in the <a href="https://www.npmjs.com/package/topster">JavaScript library I made</a>. Topsters 3 uses this to generate charts, and your project can too.</p>
    </div>
  </div>
</template>

<style scoped>
#faq {
  display: flex;
  background: var(--blue-bg);
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
