- ```javascript
  logseq.kits.setStatic(function youtubeIconLinker(div){
    // Automatically fetch the title of a youtube video.
    // Install and configuration
    //   `config.edn` macro:
    //     :yt "<div class='kit' data-kit='youtubeIconLinker'>$1</div>"
    //   Youtube API key:
    //     Place your youtube API key in a block surrounded by 
    // Usage:
    //  {{yt http://www.youtube.com/watch?v=2339f99f}}
    
      const blockId = div.closest(".ls-block").getAttribute("blockid");
      const content = logseq.api.get_block(blockId).content;
      const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
      const macroEnd = content.indexOf("}}", macroStart) + 2;
  
      // Urls may come from a mobile domain, or shortened url
      const videoIdPattern = new RegExp(/.+\/watch\?.*v=([\w\d\-_]+)(?:&{0,1}|^)/);
      const videoId = videoIdPattern.exec(div.innerHTML)[1];
  
      console.log(videoId);
      const apiKey = 'AIzaSyBvHjPX4PIYnUQHhqFGAFfJsr0cBdGl2PU';
  
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
  
          console.log("fetch video title: " + videoTitle);
      })
        .catch(error => {
          console.error('Error:', error);
          return; // Don't update the block.
        });
  });
  ```
-