// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'stuck-in-an-a24-movie' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.getElementById('channel-title')
	let channelDescription = document.getElementById('channel-description')
	// let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:

	// channelTitle.innerHTML = data.title
	let titleArray = data.title.split(" ");
	for (titleText in titleArray) {
		let output = `<span class="h1text">` + titleArray[titleText] + `</span>`;
		channelTitle.insertAdjacentHTML('beforeend', output)
	}

	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')
	let item;
	// let relaxSpeed = Math.floor(Math.random() * 2);

	// Links!
	if (block.class == 'Link') {
		item =
			`
			<li class="block linkBlock" style="opacity:${ block.position }%">
				<picture>
					<a href="${ block.source.url }" target="blank"><img src="${ block.image.original.url }"></a>
				</picture>
			`
	}

	// Images!
	else if (block.class == 'Image') {
		item =
			`
			<li class="block imageBlock" style="opacity:${ block.position }%">
				<picture>
					<img src="${ block.image.original.url }">
				</picture>
			`
	}

	// Text!
	else if (block.class == 'Text') {
		item =
			`
			<li class="block textBlock" style="opacity:${ block.position }%">
				${ block.content_html }
			`
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			item =
				`
				<li class="block videoBlock" style="opacity:${ block.position }%">
					<video controls src="${ block.attachment.url }"></video>
				`
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			item =
				`
				<li class="block pdfBlock" style="opacity:${ block.position }%">
					<picture>
						<a href="${ block.attachment.url } target="blank"" target="blank"><img src="${ block.image.original.url }"></a>
					</picture>
					`
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			item =
				`
				<li class="block audioBlock" style="opacity:${ block.position }%">
					<audio controls src="${ block.attachment.url }"></video>
				`
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			item =
				`
				<li class="block videoBlock vimeoBlock" style="opacity:${ block.position }%">
					${ block.embed.html }

				`
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {
			item =
				`
				<li class="block audioBlock" style="opacity:${ block.position }%">
					${ block.embed.html }
				`
		}
	}

	if ( block.title.includes('.jpg') || block.title.includes('.png') || block.title.includes('.mp4') || block.title == '' ) {
		item +=
		`
				<div class="info">
		`
	} else {
		item +=
		`
				<div class="info">
					<h3 class="title">${ block.title }</h3>
		`
	}

	if ( block.description != null ) {
		item +=
		`
					<p class="description">${ block.description}</p>
				</div>
			</li>
		`
	} else {
		item +=
		`
				</div>
			</li>
		`
	}

	channelBlocks.insertAdjacentHTML('beforeend', item)
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<h3><a href="https://are.na/${ user.slug }" target="blank">${ user.full_name }
			<span class="arrow">↗<span></a></h3>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.getElementById('channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
		

		//====== parallax scrolling ======
		var rellax = new Rellax('.rellax', {
			center: true
		  });

		//====== header bg video hover ======
		let headerBG = document.querySelector('#headerBG')
		let h1text = document.querySelectorAll('.h1text')

		h1text.forEach((eachText) => {

			eachText.onmouseenter = () => { // Attach the event.
				headerBG.classList.add("active") // Toggle the class!
			};
			eachText.onmouseleave = () => { // Attach the event.
				headerBG.classList.remove("active") // Toggle the class!
			};
		})


		//====== show blocks when scroll ======
		let showingClass = 'showBlock' // Variables again.
		let showingBlocks = document.querySelectorAll('.block') // Get all of them.

		// Loop through the list, doing this `forEach` one.
		showingBlocks.forEach((block) => {
			let sectionObserver = new IntersectionObserver((entries) => {
				let [entry] = entries

				if (entry.isIntersecting) {
					block.classList.add(showingClass)
				} else {
					block.classList.remove(showingClass)
				}
			}, {
				// root: document, // This is only needed in the example iframe!
				rootMargin: '-33% 0% -33% 0%', // CSS-ish: top/right/bottom/left.
			})

			sectionObserver.observe(block) // Watch each one!
		})

		//====== filter ======
		let currentFilter = "";
		let allBlock = document.querySelectorAll('.block')
		let allFilter = document.querySelectorAll('#filter span')

		// textFilter.forEach((filter) => {
		// 	filter.onclick = () => {
		// 		if (currentFilter == "text") {
		// 			resetFilter();
		// 		} else {
		// 			textFilter.forEach((text) => {
		// 				text.style.color = "white"; //filter text to white
		// 			})
		// 			allBlock.forEach((block) => {
		// 				block.style.display = "none"; //hide all blocks
		// 			})
		// 			textBlocks.forEach((block) => {
		// 				block.style.display = "block"; //show text blocks
		// 			})
		// 			currentFilter = "text";
		// 			//scroll to first text block
		// 			window.scrollTo({ top: textBlocks[0].offsetTop - 20 , behavior: 'smooth' });
		// 		}
		// 	}
		// })

		//image filter
		let imageFilter = document.querySelectorAll('.showImage');
		let imageBlocks = document.querySelectorAll('.imageBlock')

		imageFilter.forEach((filter) => {
			filter.onclick = () => {
				if (currentFilter == "image") {
					resetFilter();
				} else {
					currentFilter = "image";
					setFilter(imageFilter,imageBlocks)
				}
			}
		})

		//video filter
		let videoFilter = document.querySelectorAll('.showVideo');
		let videoBlocks = document.querySelectorAll('.videoBlock')

		videoFilter.forEach((filter) => {
			filter.onclick = () => {
				if (currentFilter == "video") {
					resetFilter();
				} else {
					currentFilter = "video";
					setFilter(videoFilter,videoBlocks)
				}
			}
		})

		//text filter
		let textFilter = document.querySelectorAll('.showText');
		let textBlocks = document.querySelectorAll('.textBlock')

		textFilter.forEach((filter) => {
			filter.onclick = () => {
				if (currentFilter == "text") {
					resetFilter();
				} else {
					currentFilter = "text";
					setFilter(textFilter,textBlocks)
				}
			}
		})

		//audio filter
		let audioFilter = document.querySelectorAll('.showAudio');
		let audioBlocks = document.querySelectorAll('.audioBlock')

		audioFilter.forEach((filter) => {
			filter.onclick = () => {
				if (currentFilter == "audio") {
					resetFilter();
				} else {
					currentFilter = "audio";
					setFilter(audioFilter,audioBlocks)
				}
			}
		})

		//link filter
		let linkFilter = document.querySelectorAll('.showLink');
		let linkBlocks = document.querySelectorAll('.linkBlock')

		linkFilter.forEach((filter) => {
			filter.onclick = () => {
				if (currentFilter == "link") {
					resetFilter();
				} else {
					currentFilter = "link";
					setFilter(linkFilter,linkBlocks)
				}
			}
		})

		function setFilter(typeOfFilter, typeOfBlocks) {
			allFilter.forEach((text) => {
				text.style.color = "var(--bg-color)";
			})
			typeOfFilter.forEach((text) => {
				text.style.color = "white"; //filter text to white
			})
			allBlock.forEach((block) => {
				block.style.display = "none"; //hide all blocks
			})
			typeOfBlocks.forEach((block) => {
				block.style.display = "block"; //show text blocks
			})
			//scroll to first text block
			window.scrollTo({ top: typeOfBlocks[0].offsetTop - 30 , behavior: 'smooth' });
		}

		function resetFilter() {
			allFilter.forEach((text) => {
				text.style.color = "var(--bg-color)";
			})
			allBlock.forEach((block) => {
				block.style.display = "block";
			})
			currentFilter = "";
		}

	})
