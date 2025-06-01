let loveTaps = new Set();

function startApp() {
  const cardStage = document.getElementById('cardStage');
  const startStage = document.getElementById('startStage');
  const inputStage = document.getElementById('inputStage');
  const loveStage = document.getElementById('loveStage');
  const music = document.getElementById('bgMusic');

  if (!cardStage || !startStage || !inputStage || !loveStage) {
    console.error('Không tìm thấy cardStage, startStage, inputStage hoặc loveStage!');
    return;
  }

  startStage.style.display = 'none';
  inputStage.style.display = 'block';
  loveStage.style.display = 'none';
  cardStage.style.display = 'none';

  if (music) {
    music.play().catch((err) => console.warn('Không thể phát nhạc:', err));
  } else {
    console.warn('Không tìm thấy element bgMusic!');
  }

  inipesan();
}

// Hiệu ứng gõ chữ
function typeWriterEffect(text, elementId, callback) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Không tìm thấy element với ID: ${elementId}`);
    return;
  }

  let i = 0;
  const speed = 50;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      console.log('Hiệu ứng gõ hoàn tất, chạy callback');
      callback();
    }
  }

  element.textContent = '';
  type();
}

// Chuyển màn
function switchStage(fromId, toId) {
  const fromElement = document.getElementById(fromId);
  const toElement = document.getElementById(toId);

  if (!fromElement || !toElement) {
    console.error(`Không tìm thấy element: ${fromId} hoặc ${toId}`);
    return;
  }

  if (fromId === 'loveStage') {
    fromElement.classList.add('hidden'); // Thêm class để fade-out
    setTimeout(() => {
      fromElement.style.display = 'none'; // Ẩn hoàn toàn sau fade-out
      toElement.style.display = 'block'; // Hiện màn mới
    }, 1000); // Đợi 1s để fade-out hoàn tất
  } else {
    fromElement.style.display = 'none';
    toElement.style.display = 'block';
  }
}

function tapLove(id) {
  const loveIcon = document.querySelector(`#loveIcons .love-icon:nth-child(${id})`);
  if (!loveIcon.classList.contains('tapped')) {
    loveIcon.classList.add('tapped');
    loveTaps.add(id);
    console.log(`Chạm love ${id}, tổng: ${loveTaps.size}`);
  }

  if (loveTaps.size === 4) {
    Swal.fire({
      title: 'Đủ 4 love rồi nè!',
      text: 'Sẵn sàng nhận quà chưa? 💖',
      timer: 1500,
      showConfirmButton: false,
      background: '#fffbe7',
      customClass: { title: 'swal-title', content: 'swal-text' }
    }).then(() => {
      switchStage('loveStage', 'cardStage');
      const loveMsg = document.getElementById('loveMsg');
      if (!loveMsg) {
        console.error('Không tìm thấy element loveMsg!');
        return;
      }

      loveMsg.textContent = '';
      typeWriterEffect(
        `Chúc Ngân Nhi của anh 1/6 thật vui vẻ như một đứa trẻ, nhưng được anh yêu như một nữ hoàng 👑. Dù em có lớn bao nhiêu thì trong tim anh, em vẫn là công chúa bé bỏng cần được cưng chiều mỗi ngày! 💘`,
        'loveMsg',
        () => {
          console.log('Bắt đầu thêm fromTag'); // Debug
          const fromTag = document.createElement("div");
          fromTag.id = 'fromTag';
          fromTag.textContent = "From: Việt Anh";
          fromTag.style.marginTop = "20px";
          fromTag.style.opacity = "0";
          fromTag.style.transition = "opacity 1s ease";
          loveMsg.appendChild(fromTag);

          console.log('fromTag đã được thêm vào DOM:', fromTag);
          setTimeout(() => {
            console.log('Hiển thị fromTag với opacity = 1'); // Debug
            fromTag.style.opacity = "1";
          }, 500);
        }
      );
    });
  }
}

// Nhập tên với hiệu ứng "đánh lừa"
async function inipesan() {
  const targetName = "Ngân Nhi";
  let currentIndex = 0;

  const { value: typedName } = await Swal.fire({
    title: 'Nhập Tên Của Bé Iuu đi',
    input: 'text',
    inputValue: '',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: true,
    didOpen: () => {
      const input = Swal.getInput();
      if (!input) return;

      input.value = '';
      // Bắt sự kiện input để "đánh lừa"
      input.addEventListener('input', (e) => {
        e.preventDefault(); // Ngăn hành vi mặc định
        if (currentIndex < targetName.length) {
          input.value = targetName.slice(0, currentIndex + 1);
          currentIndex++;
        } else {
          input.value = targetName; // Giữ nguyên nếu đã gõ hết
        }
      });
    },
    preConfirm: () => {
      const input = Swal.getInput();
      return input.value || targetName; // Trả về tên nhập hoặc tên mặc định
    }
  });

  if (typedName) {
    loveTaps.clear();
    const loveIcons = document.querySelectorAll('.love-icon');
    loveIcons.forEach(icon => icon.classList.remove('tapped'));
    switchStage('inputStage', 'loveStage');
  }
}