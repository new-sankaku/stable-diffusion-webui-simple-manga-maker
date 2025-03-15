class Character {
  static defaultBaseConfig = {
    position: {
      right: '20px',
      bottom: '20px'
    },
    size: {
      width: 150,
      height: 200
    },
    zIndex: {
      container: 1000,
      popup: 1001
    },
    image: {
      src: '00092--rebuild.png',
      alt: 'キャラクター'
    }
  };

  static defaultAnimationConfig = {
    glow: {
      duration: 500,
      color: 'rgba(255, 255, 255, 0.5)',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowSize: '25px'
    },
    exp: {
      duration: 1000,
      fontSize: '16px',
      color: '#B8860B',
      textShadowColor: '#444'
    },
    character: {
      transitionDuration: '0.2s'
    }
  };

  static defaultEventConfig = {
    thresholds: {
      click: 200,
      scroll: 100,
      input: 100,
      moveThreshold: 5
    },
    expGain: {
      click: 10,
      scroll: 2,
      input: 3
    }
  };

  static defaultConversationConfig = {
    tooltip: {
      placement: 'left',
      trigger: 'manual',
      theme: 'custom',
      arrow: true,
      interactive: true,
      maxWidth: 200,
      backgroundColor: 'white',
      textColor: 'black',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '10px'
    },
    messages: {
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
    }
  };

  constructor(config = {}) {
    this.config = this.mergeConfig(config);
    this.wrapper = null;
    this.img = null;
    this.tippyInstance = null;
    this.currentConversationIndex = 0;
    this.currentEventType = 'default';
    this.totalExp = 0;
    this.lastClickTime = 0;
    this.lastScrollTime = 0;
    this.lastInputTime = 0;
    
    this.initialize();
    this.bindEvents();
  }

  mergeConfig(userConfig) {
    return {
      base: {
        ...Character.defaultBaseConfig,
        ...userConfig.base
      },
      animation: {
        ...Character.defaultAnimationConfig,
        ...userConfig.animation
      },
      event: {
        ...Character.defaultEventConfig,
        ...userConfig.event
      },
      conversation: {
        ...Character.defaultConversationConfig,
        ...userConfig.conversation
      }
    };
  }

  createStyles() {
    const styleSheet = document.createElement('style');
    const { base, animation } = this.config;
    
    styleSheet.textContent = `
      @keyframes glowEffect {
        0% { 
          filter: drop-shadow(0 8px ${animation.glow.shadowSize} ${animation.glow.shadowColor});
          transform: scale(1);
        }
        50% { 
          filter: drop-shadow(0 8px ${animation.glow.shadowSize} ${animation.glow.color});
          transform: scale(1);
        }
        100% { 
          filter: drop-shadow(0 8px ${animation.glow.shadowSize} ${animation.glow.shadowColor});
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
        right: ${base.position.right};
        bottom: ${base.position.bottom};
        touch-action: none;
        transform: translate(0px, 0px);
        z-index: ${base.zIndex.container};
      }
      
      #character-inner {
        filter: drop-shadow(0 8px ${animation.glow.shadowSize} ${animation.glow.shadowColor});
      }
      
      #character {
        width: ${base.size.width}px;
        height: ${base.size.height}px;
        cursor: grab;
        user-select: none;
        object-fit: contain;
        transition: transform ${animation.character.transitionDuration} ease;
        will-change: transform;
      }
      
      .glow {
        animation: glowEffect ${animation.glow.duration}ms ease-in-out;
      }
      
      .exp-popup {
        position: absolute;
        color: ${animation.exp.color};
        text-shadow: -1px -1px 0 ${animation.exp.textShadowColor},
                     1px -1px 0 ${animation.exp.textShadowColor},
                    -1px 1px 0 ${animation.exp.textShadowColor},
                     1px 1px 0 ${animation.exp.textShadowColor};
        font-weight: bold;
        font-size: ${animation.exp.fontSize};
        animation: expGain ${animation.exp.duration}ms ease-out forwards;
        pointer-events: none;
        z-index: ${base.zIndex.popup};
      }
      
      .tippy-box {
        background-color: ${this.config.conversation.tooltip.backgroundColor};
        color: ${this.config.conversation.tooltip.textColor};
        box-shadow: ${this.config.conversation.tooltip.boxShadow};
        border-radius: ${this.config.conversation.tooltip.borderRadius};
        max-width: ${this.config.conversation.tooltip.maxWidth}px !important;
      }
      
      .tippy-arrow {
        color: ${this.config.conversation.tooltip.backgroundColor};
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
    this.img.alt = this.config.base.image.alt;
    this.img.src = this.config.base.image.src;
  
    innerWrapper.appendChild(this.img);
    this.wrapper.appendChild(innerWrapper);
    document.body.appendChild(this.wrapper);
    
    this.tippyInstance = tippy(this.img, {
      content: this.config.conversation.messages.default[0].text,
      placement: this.config.conversation.tooltip.placement,
      trigger: this.config.conversation.tooltip.trigger,
      theme: this.config.conversation.tooltip.theme,
      arrow: this.config.conversation.tooltip.arrow,
      interactive: this.config.conversation.tooltip.interactive,
      maxWidth: this.config.conversation.tooltip.maxWidth
    });
  
    this.updateConversation('default');
    this.initializeDrag();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .card, a, input[type="submit"]')) {
        this.addExp(this.config.event.expGain.click);
      }
    });

    const testInput = document.getElementById('testInput');
    if (testInput) {
      testInput.addEventListener('input', () => {
        const now = Date.now();
        if (now - this.lastInputTime > this.config.event.thresholds.input) {
          this.addExp(this.config.event.expGain.input);
          this.lastInputTime = now;
        }
      });
    }

    document.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - this.lastScrollTime > this.config.event.thresholds.scroll) {
        this.addExp(this.config.event.expGain.scroll);
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
            this.tippyInstance.setProps({ placement: this.config.conversation.tooltip.placement });
          }
        },
        end: (event) => {
          const clickDuration = Date.now() - this.lastClickTime;
          const moveThreshold = this.config.event.thresholds.moveThreshold;
          if (clickDuration < this.config.event.thresholds.click && 
              Math.abs(event.dx) < moveThreshold && 
              Math.abs(event.dy) < moveThreshold) {
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
    }, this.config.animation.glow.duration);
  }

  toggleBubble() {
    this.tippyInstance.state.isVisible ? this.tippyInstance.hide() : this.tippyInstance.show();
  }

  showNextMessage() {
    const conversationArray = this.config.conversation.messages[this.currentEventType];
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