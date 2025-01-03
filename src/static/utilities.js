async function fetchAvailableImagesList() {
  try {
    // Fetch the list of images
    const response = await fetch('/original/list');
    const images = await response.json();
    console.info('Got list of images: ', images);
    return images;
  } catch (error) {
    console.error('Failed to fetch images:', error);
  }
}

function updateImage(imgId, image) {
  const imageDisplay = document.getElementById(imgId);
  imageDisplay.src = `/original/${image}`;
  imageDisplay.class = 'active';

  if (!imageDisplay.classList.contains('active')) {
    imageDisplay.classList.add('active');
  }
}

function updateImageAndName(textId, imgId, image) {
  const imageDisplay = document.getElementById(imgId);
  imageDisplay.src = `/original/${image}`;
  imageDisplay.class = 'active';

  if (!imageDisplay.classList.contains('active')) {
    imageDisplay.classList.add('active');
  }

  const textBox = document.getElementById(textId);
  textBox.value = image;
}
