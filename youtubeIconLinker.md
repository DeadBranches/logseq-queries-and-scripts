kit:: yt

- ```javascript
  logseq.kits.setStatic(function youtubeIconLinker(div){
    // Automatically fetch the title of a youtube video.
    // Install and configuration
    //   `config.edn` macro:
    //     :yt "<div class='kit' data-kit='youtubeIconLinker'>$1</div>"
    //   Youtube API key:
    //     1. Place your youtube API key alone in a block surrounded
    //        by grave accents (``) on any page you want. 
    //        E.g. `xxxxxxxxxxxxxxxxxxxx`
    //     2. Copy the block reference for the block with the API key
    //     3. Paste the block uuid into the apiKeyBlock variable below,
    //        removing the surrounding parentheses.
    // Usage:
    //  {{yt http://www.youtube.com/watch?v=2339f99f}}
  
  	const apiKeyBlock = '662eef00-5520-477f-995b-8235321ee2b8';
   
      const apiKey = logseq.api.get_block(apiKeyBlock).content.split('`')[1];
    
      const blockId = div.closest(".ls-block").getAttribute("blockid");
      const content = logseq.api.get_block(blockId).content;
      const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
      const macroEnd = content.indexOf("}}", macroStart) + 2;
  
      // Urls may come from a mobile domain, or shortened url
      const videoIdPattern = new RegExp(/.+\/watch\?.*v=([\w\d\-_]+)(?:&{0,1}|^)/);
      const videoId = videoIdPattern.exec(div.innerHTML)[1];
  
      // Get the video title from the YouTube API.
      fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then(data => {
          let videoTitle = data.items[0].snippet.title;
          const youtubeLink = "{{i f214}} [" + videoTitle + "](" + div.innerHTML + ")";
          logseq.api.update_block(blockId, content.slice(0, macroStart) + youtubeLink + content.slice(macroEnd));
      })
        .catch(error => {
          console.error('Error:', error);
          return; // Don't update the block.
        });
  });
  ```
-