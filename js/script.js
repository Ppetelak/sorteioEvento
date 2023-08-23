var totalSpins = 0;
var replaySpins = 0;
var allinAfterReplaySpins = 0;

var data = [
    { id: '0', type: 'time', color: '#1d61ac', text: 'UHUL!', ikon: 'minor_crash' },
    { id: '1', type: 'replay', color: '#169ed8', text: 'HJ não', ikon: 'sentiment_dissatisfied' },
    { id: '2', type: 'time', color: '#209b6c', text: 'UHUL!', ikon: 'minor_crash' },
    { id: '3', type: 'replay', color: '#60b236', color: '#dc0936', text: 'HJ não', ikon: 'sentiment_dissatisfied' },
    { id: '4', type: 'replay', color: '#efe61f', text: 'Não foi dessa vez'},
    { id: '5', type: 'time', color: '#e6471d', text: 'UHUL!', ikon: 'minor_crash' },
    { id: '6', type: 'replay', color: '#dc0936', text: 'HJ não', ikon: 'sentiment_dissatisfied' },
    { id: '7', type: 'time', color: '#be107f', text: 'UHUL!', ikon: 'minor_crash' },
    { id: '8', type: 'replay', color: '#881f7e', text: 'Não foi dessa vez' }
];


var RouletteWheel = function (el, items) {
    this.$el = $(el);
    this.items = items || [];
    this._bis = false;
    this._angle = 0;
    this._index = 0;
    this.options = {
        angleOffset: -90
    }
}

_.extend(RouletteWheel.prototype, Backbone.Events);

RouletteWheel.prototype.spin = function (_index) {

    var count = this.items.length;
    var delta = 360 / count;
    var index = !isNaN(parseInt(_index)) ? parseInt(_index) : parseInt(Math.random() * count);
    //var index = _index;

    var a = index * delta + ((this._bis) ? 1440 : -1440);

    console.log(index)

    this._bis = !this._bis;
    this._angle = a;
    this._index = index;

    var $spinner = $(this.$el.find('.spinner'));

    var _onAnimationBegin = function () {
        this.$el.addClass('busy');
        this.trigger('spin:start', this);
    }

    var _onAnimationComplete = function () {
        this.$el.removeClass('busy');
        this.trigger('spin:end', this);
    }

    $spinner
        .velocity('stop')
        .velocity({
            rotateZ: a + 'deg'
        }, {
            easing: [20, 7],
            easing: [200, 20],
            easing: 'easeOutQuint',
            duration: 5000,
            begin: $.proxy(_onAnimationBegin, this),
            complete: $.proxy(_onAnimationComplete, this)
        });

}

RouletteWheel.prototype.render = function () {

    var $spinner = $(this.$el.find('.spinner'));
    var D = this.$el.width();
    var R = D * .5;

    var count = this.items.length;
    var delta = 360 / count;

    for (var i = 0; i < count; i++) {

        var item = this.items[i];

        var color = item.color;
        var text = item.text;
        var ikon = item.ikon;

        var html = [];
        html.push('<div class="item" ');
        html.push('data-index="' + i + '" ');
        html.push('data-type="' + item.type + '" ');
        html.push('>');
        html.push('<span class="label">');
        if (ikon)
            html.push('<i class="material-icons">' + ikon + '</i>');
        html.push('<span class="text">' + text + '</span>');
        html.push('</span>');
        html.push('</div>');

        var $item = $(html.join(''));

        var borderTopWidth = D + D * 0.0025; //0.0025 extra :D
        var deltaInRadians = delta * Math.PI / 180;
        var borderRightWidth = D / (1 / Math.tan(deltaInRadians));

        var r = delta * (count - i) + this.options.angleOffset - delta * .5;

        $item.css({
            borderTopWidth: borderTopWidth,
            borderRightWidth: borderRightWidth,
            transform: 'scale(2) rotate(' + r + 'deg)',
            borderTopColor: color
        });

        var textHeight = parseInt(((2 * Math.PI * R) / count) * .5);

        $item.find('.label').css({
            //transform: 'translateX('+ (textHeight) +'px) translateY('+  (-1 * R) +'px) rotateZ('+ (90 + delta*.5) +'deg)',
            transform: 'translateY(' + (D * -.25) + 'px) translateX(' + (textHeight * 1.03) + 'px) rotateZ(' + (90 + delta * .5) + 'deg)',
            height: textHeight + 'px',
            lineHeight: textHeight + 'px',
            textIndent: (R * .1) + 'px'
        });

        $spinner.append($item);

    }

    $spinner.css({
        fontSize: parseInt(R * 0.06) + 'px'
    })

    //this.renderMarker();


}

RouletteWheel.prototype.renderMarker = function () {

    var $markers = $(this.$el.find('.markers'));
    var D = this.$el.width();
    var R = D * .5;

    var count = this.items.length;
    var delta = 360 / count;

    var borderTopWidth = D + D * 0.0025; //0.0025 extra :D
    var deltaInRadians = delta * Math.PI / 180;
    var borderRightWidth = (D / (1 / Math.tan(deltaInRadians)));

    var i = 0;
    var $markerA = $('<div class="marker">');
    var $markerB = $('<div class="marker">');

    var rA = delta * (count - i - 1) - delta * .5 + this.options.angleOffset;
    var rB = delta * (count - i + 1) - delta * .5 + this.options.angleOffset;

    $markerA.css({
        borderTopWidth: borderTopWidth,
        borderRightWidth: borderRightWidth,
        transform: 'scale(2) rotate(' + rA + 'deg)',
        borderTopColor: '#FFF'
    });
    $markerB.css({
        borderTopWidth: borderTopWidth,
        borderRightWidth: borderRightWidth,
        transform: 'scale(2) rotate(' + rB + 'deg)',
        borderTopColor: '#FFF'
    })

    $markers.append($markerA);
    $markers.append($markerB);

}

RouletteWheel.prototype.bindEvents = function () {
    this.$el.find('.button').on('click', $.proxy(this.spin, this));
}


var spinner;
$(window).ready(function () {
    spinner = new RouletteWheel($('.roulette'), data);
    spinner.render();
    spinner.bindEvents();

    spinner.on('spin:start', function (r) { console.log('spin start!') });
    spinner.on('spin:end', function (r) {
        console.log('spin end! -->' + r._index);
        if (r._index === 0 || r._index === 2 || r._index === 5 || r._index === 7)
        {
            startConfetti();
            document.getElementById('deuboa').classList.remove('d-none');
        }
        else{
            document.getElementById('deuruim').classList.remove('d-none');
        }
        var index = $('[data-index]');
        document.getElementById('numeroSorte').classList.remove('d-none');
        console.log(data);
    });
})

function startConfetti() {
    const particlesOptions = {
      fpsLimit: 60,
      particles: {
        number: {
          value: 0
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: ["circle", "square", "polygon"],
          options: {
            polygon: {
              sides: 6
            }
          }
        },
        opacity: {
          value: { min: 0, max: 1 },
          animation: {
            enable: true,
            speed: 1,
            startValue: "max",
            destroy: "min"
          }
        },
        size: {
          value: { min: 2, max: 5 }
        },
        life: {
          duration: {
            sync: true,
            value: 7
          },
          count: 1
        },
        move: {
          enable: true,
          gravity: {
            enable: true
          },
          drift: {
            min: -2,
            max: 2
          },
          speed: { min: 10, max: 30 },
          decay: 0.1,
          direction: "none",
          random: false,
          straight: false,
          outModes: {
            default: "destroy",
            top: "none"
          }
        },
        rotate: {
          value: {
            min: 0,
            max: 360
          },
          direction: "random",
          move: true,
          animation: {
            enable: true,
            speed: 60
          }
        },
        tilt: {
          direction: "random",
          enable: true,
          move: true,
          value: {
            min: 0,
            max: 360
          },
          animation: {
            enable: true,
            speed: 60
          }
        },
        roll: {
          darken: {
            enable: true,
            value: 25
          },
          enable: true,
          speed: {
            min: 15,
            max: 25
          }
        },
        wobble: {
          distance: 30,
          enable: true,
          move: true,
          speed: {
            min: -15,
            max: 15
          }
        }
      },
      detectRetina: true,
      emitters: {
        direction: "none",
        spawnColor: {
          value: ["#8D75FF", "#F053BB", "#1B87EC", "#A98FFF"],
          animation: {
            h: {
              enable: true,
              offset: {
                min: -1.4,
                max: 1.4
              },
              speed: 0.1,
              sync: false
            },
            l: {
              enable: true,
              offset: {
                min: 20,
                max: 80
              },
              speed: 0,
              sync: false
            }
          }
        },
        life: {
          count: 3,
          duration: 0.1,
          delay: 0.6
        },
        rate: {
          delay: 0.1,
          quantity: 100
        },
        size: {
          width: 0,
          height: 0
        }
      }
    };
  
    tsParticles.load('confetti-container', particlesOptions);
}
  
//startConfetti();


