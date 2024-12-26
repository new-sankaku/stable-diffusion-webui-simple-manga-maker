class Character {
  constructor() {
    this.wrapper = null;
    this.img = null;
    this.tippyInstance = null;
    this.currentConversationIndex = 0;
    this.currentEventType = 'default';
    this.totalExp = 0;
    this.lastClickTime = 0;
    this.lastScrollTime = 0;
    this.lastInputTime = 0;
    this.CLICK_THRESHOLD = 200;
    this.SCROLL_THRESHOLD = 100;
    this.INPUT_THRESHOLD = 100;
    this.conversations = {
      default: [{
        text: 'こんにちは！お手伝いできることはありますか？',
        image: '00092--rebuild.png'
      }],
      event1: [{
        text: 'カード1についてご説明しましょう',
        image: '00092--rebuild.png'
      }, {
        text: '主な機能は3つあります'
      }, {
        text: '1つ目は自動応答機能です',
        image: '00092--rebuild.png'
      }],
      event2: [{
        text: 'カード2ですね',
        image: '00092--rebuild.png'
      }, {
        text: '詳しい内容をお話ししましょう'
      }, {
        text: '興味深い機能がたくさんありますよ'
      }],
      event3: [{
        text: 'カード3を選びましたか',
        image: '00092--rebuild.png'
      }, {
        text: 'このカードが一番人気です'
      }, {
        text: '特別な機能をご紹介しましょう',
        image: '00092--rebuild.png'
      }],
      event4: [{
        text: 'カード4についてですね',
        image: '00092--rebuild.png'
      }, {
        text: '最新の機能が詰まっています'
      }, {
        text: 'デモをお見せしましょうか'
      }]
    };
    
    this.initialize();
    this.bindEvents();
  }

  createStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
@keyframes glowEffect {
  0% { 
    filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.5));
    transform: scale(1);
  }
  50% { 
    filter: drop-shadow(0 8px 25px rgba(255, 255, 255, 0.5));
    transform: scale(1);
  }
  100% { 
    filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.5));
    transform: scale(1);
  }
}
      
      @keyframes expGain {
        0% { transform: translateY(0); opacity: 0; }
        20% { transform: translateY(-5px); opacity: 1; }
        80% { transform: translateY(-15px); opacity: 1; }
        100% { transform: translateY(-20px); opacity: 0; }
      }
      
      #character-container {
        position: fixed;
        right: 20px;
        bottom: 20px;
        touch-action: none;
        transform: translate(0px, 0px);
        z-index: 1000;
      }
      
      #character-inner {
        filter: drop-shadow(0 8px 10px rgba(255, 9, 9, 0.9));
      }
      
      #character {
        width: 150px;
        height: 200px;
        cursor: grab;
        user-select: none;
        object-fit: contain;
        transition: transform 0.2s ease;
        will-change: transform;
      }
      
      .glow {
        animation: glowEffect 0.5s ease-in-out;
      }
      
      .exp-popup {
        position: absolute;
        color: #B8860B;
        text-shadow: -1px -1px 0 #444, 1px -1px 0 #444, -1px 1px 0 #444, 1px 1px 0 #444;
        font-weight: bold;
        font-size: 16px;
        animation: expGain 1s ease-out forwards;
        pointer-events: none;
        z-index: 1001;
      }
      
      .tippy-box {
        background-color: white;
        color: black;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        border-radius: 10px;
        max-width: 200px !important;
      }
      
      .tippy-arrow {
        color: white;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  initialize() {
    this.createStyles();
    
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'character-container';
  
    const innerWrapper = document.createElement('div');
    innerWrapper.id = 'character-inner';
    
    this.img = document.createElement('img');
    this.img.id = 'character';
    this.img.alt = 'キャラクター';
    this.img.src = '00092--rebuild.png';
  
    innerWrapper.appendChild(this.img);
    this.wrapper.appendChild(innerWrapper);
    document.body.appendChild(this.wrapper);
    
    this.tippyInstance = tippy(this.img, {
      content: this.conversations.default[0].text,
      placement: 'left',
      trigger: 'manual',
      theme: 'custom',
      arrow: true,
      interactive: true
    });
  
    this.updateConversation('default');
    this.initializeDrag();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .card, a, input[type="submit"]')) {
        this.addExp(10);
      }
    });

    // input要素のイベントハンドリングを修正
    const testInput = document.getElementById('testInput');
    if (testInput) {
      testInput.addEventListener('input', () => {
        const now = Date.now();
        if (now - this.lastInputTime > this.INPUT_THRESHOLD) {
          this.addExp(3);
          this.lastInputTime = now;
        }
      });
    }

    document.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - this.lastScrollTime > this.SCROLL_THRESHOLD) {
        this.addExp(2);
        this.lastScrollTime = now;
      }
    });

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const eventType = card.dataset.event;
        this.updateConversation(eventType);
      });
    });
  }

  initializeDrag() {
    interact(this.wrapper).draggable({
      listeners: {
        start: (event) => {
          this.lastClickTime = Date.now();
          this.img.style.cursor = 'grabbing';
        },
        move: (event) => {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
          if (this.tippyInstance.state.isVisible) {
            this.tippyInstance.setProps({ placement: 'left' });
          }
        },
        end: (event) => {
          const clickDuration = Date.now() - this.lastClickTime;
          if (clickDuration < this.CLICK_THRESHOLD && Math.abs(event.dx) < 5 && Math.abs(event.dy) < 5) {
            this.toggleBubble();
          }
          this.img.style.cursor = 'grab';
        }
      }
    });
  }

  addExp(amount) {
    const popup = document.createElement('div');
    popup.className = 'exp-popup';
    popup.textContent = `+${amount} EXP`;
    const randomX = Math.random() * 30 - 15;
    popup.style.left = `calc(50% + ${randomX}px)`;
    popup.style.top = '20px';
    this.wrapper.appendChild(popup);
    
    const innerWrapper = this.wrapper.querySelector('#character-inner');
    innerWrapper.classList.add('glow');
    
    popup.addEventListener('animationend', () => {
      popup.remove();
    });
    
    setTimeout(() => {
      innerWrapper.classList.remove('glow');
    }, 500);
  }

  toggleBubble() {
    this.tippyInstance.state.isVisible ? this.tippyInstance.hide() : this.tippyInstance.show();
  }

  showNextMessage() {
    const conversationArray = this.conversations[this.currentEventType];
    if (this.currentConversationIndex < conversationArray.length) {
      const conversation = conversationArray[this.currentConversationIndex];
      if (conversation.image) {
        this.img.src = conversation.image;
      }
      this.tippyInstance.setContent(conversation.text);
      this.tippyInstance.show();
      this.currentConversationIndex++;
    } else {
      this.tippyInstance.hide();
      this.currentConversationIndex = 0;
    }
  }

  updateConversation(eventType) {
    this.currentEventType = eventType;
    this.currentConversationIndex = 0;
    this.showNextMessage();
    this.tippyInstance.setProps({
      onHidden: () => this.showNextMessage()
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Character();
});