
document.addEventListener("DOMContentLoaded", () => {
  class ItcTabs {
    constructor(target, config = {}) {
      this._config = Object.assign({ autoSwitch: true, interval: 3000 }, config); // Авто-пролистывание включено по умолчанию
      this._elTabs = typeof target === "string" ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll(".tabs__btn");
      this._elPanes = this._elTabs.querySelectorAll(".tabs__pane");
      this._eventShow = new Event("tab.itc.change");
      this._currentIndex = 0;
      this._init();
      this._events();
      if (this._config.autoSwitch) {
        this._startAutoSwitch();
      }
    }

    _init() {
      this._elTabs.setAttribute("role", "tablist");
      this._elButtons.forEach((el, index) => {
        el.dataset.index = index;
        el.setAttribute("role", "tab");
        this._elPanes[index].setAttribute("role", "tabpanel");
      });
    }

    show(elLinkTarget) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector(".tabs__btn_active");
      const elPaneShow = this._elTabs.querySelector(".tabs__pane_show");

      if (elLinkTarget === elLinkActive) return;

      elLinkActive?.classList.remove("tabs__btn_active");
      elPaneShow?.classList.remove("tabs__pane_show");

      elLinkTarget.classList.add("tabs__btn_active");
      elPaneTarget.classList.add("tabs__pane_show");
      this._currentIndex = Number(elLinkTarget.dataset.index);
      this._elTabs.dispatchEvent(this._eventShow);
    }

    showByIndex(index) {
      const elLinkTarget = this._elButtons[index];
      if (elLinkTarget) {
        this.show(elLinkTarget);
      }
    }

    _startAutoSwitch() {
      this._autoSwitchInterval = setInterval(() => {
        this._currentIndex = (this._currentIndex + 1) % this._elButtons.length;
        this.showByIndex(this._currentIndex);
      }, this._config.interval);

      // Останавливаем автопереключение при наведении на вкладки
      this._elTabs.addEventListener("mouseenter", () => clearInterval(this._autoSwitchInterval));
      this._elTabs.addEventListener("mouseleave", () => this._startAutoSwitch());
    }

    _events() {
      this._elTabs.addEventListener("click", (e) => {
        const target = e.target.closest(".tabs__btn");
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }
  }

  // Инициализация с автопереключением (3 секунды)
  new ItcTabs(".tabs", { autoSwitch: true, interval: 7000 });
});

window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
document.addEventListener("DOMContentLoaded", () => {
  (function ($) {
    var elActive = '';
    $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
        color: "#888888", // color
        backgroundColor: "#FFFFFF", // background
        change: function () { }, // event change
      }, options);

      return this.each(function () {

        var selectParent = $(this);
        list = [],
          html = '';

        //parameter CSS
        var width = $(selectParent).width();

        $(selectParent).hide();
        if ($(selectParent).children('option').length == 0) { return; }
        $(selectParent).children('option').each(function () {
          if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
          list.push({
            value: $(this).attr('value'),
            text: $(this).text(),
            selected: s,
          })
        })

        // style
        var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

        html += "<ul class='selectCF'>";
        html += "<li>";
        html += "<span class='arrowCF ion-chevron-right' style='" + style + "'></span>";
        html += "<span class='titleCF' style='" + style + "; width:" + width + "px'>" + title + "</span>";
        html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
        html += "<ul>";
        $.each(list, function (k, v) {
          s = (v.selected == 1) ? "selected" : "";
          html += "<li value=" + v.value + " class='" + s + "'>" + v.text + "</li>";
        })
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        $(selectParent).after(html);
        var customSelect = $(this).next('ul.selectCF'); // add Html
        var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
        var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
        var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

        // handle active select
        $(customSelect).unbind('click').bind('click', function (e) {
          e.stopPropagation();
          if ($(this).hasClass('onCF')) {
            elActive = '';
            $(this).removeClass('onCF');
            $(this).removeClass('searchActive'); $(seachElInput).val('');
            $(seachElOption).show();
          } else {
            if (elActive != '') {
              $(elActive).removeClass('onCF');
              $(elActive).removeClass('searchActive'); $(seachElInput).val('');
              $(seachElOption).show();
            }
            elActive = $(this);
            $(this).addClass('onCF');
            $(seachEl).children('input').focus();
          }
        })

        // handle choose option
        var optionSelect = $(customSelect).children('li').children('ul').children('li');
        $(optionSelect).bind('click', function (e) {
          var value = $(this).attr('value');
          if ($(this).hasClass('selected')) {
            //
          } else {
            $(optionSelect).removeClass('selected');
            $(this).addClass('selected');
            $(customSelect).children('li').children('.titleCF').html($(this).html());
            $(selectParent).val(value);
            settings.change.call(selectParent); // call event change
          }
        })

        // handle search 
        $(seachEl).children('input').bind('keyup', function (e) {
          var value = $(this).val();
          if (value) {
            $(customSelect).addClass('searchActive');
            $(seachElOption).each(function () {
              if ($(this).text().search(new RegExp(value, "i")) < 0) {
                // not item
                $(this).fadeOut();
              } else {
                // have item
                $(this).fadeIn();
              }
            })
          } else {
            $(customSelect).removeClass('searchActive');
            $(seachElOption).fadeIn();
          }
        })

      });
    };
    $(document).click(function () {
      if (elActive != '') {
        $(elActive).removeClass('onCF');
        $(elActive).removeClass('searchActive');
      }
    })
  }(jQuery));

  $(function () {
    var event_change = $('#event-change');
    $(".select").selectCF({
      change: function () {
        var value = $(this).val();
        var text = $(this).children('option:selected').html();
        console.log(value + ' : ' + text);
        event_change.html(value + ' : ' + text);
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const swiper1 = new Swiper('.swiper1', {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: ".swiper-pagination1",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 0,
        slidesPerView: 1
      }
    }
  });
  const swiper2 = new Swiper('.swiper2', {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    slideToClickedSlide: true,
    centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next2',
      prevEl: '.swiper-button-prev2',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 15,
        loop: true,
        initialSlide: 1,
        slidesPerView: 1
      },
      576: {
        spaceBetween: 15,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 15,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 20,
        slidesPerView: 4
      }
    }
  });
  const swiper3 = new Swiper('.swiper3', {
    slidesPerView: 6,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next3',
      prevEl: '.swiper-button-prev3',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 15,
        loop: true,
        initialSlide: 1,
        slidesPerView: 1
      },
      576: {
        spaceBetween: 15,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 15,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 6
      },
      1200: {
        spaceBetween: 20,
        slidesPerView: 6
      }
    }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  let za1 = document.querySelector('.what .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    za1.style.transform = 'translate(-' + x * 80 + 'px, -' + y * 80 + 'px)';
  });
  let za2 = document.querySelector('.what .header__fig_2');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    za2.style.transform = 'translate(-' + x * 80 + 'px, +' + y * 80 + 'px)';
  });
  let za3 = document.querySelector('.what .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    za3.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let za4 = document.querySelector('.what .header__fig_4');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    za4.style.transform = 'translate(-' + x * 80 + 'px, -' + y * 50 + 'px)';
  });

  let me1 = document.querySelector('.header .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    me1.style.transform = 'translate(-' + x * 80 + 'px, -' + y * 80 + 'px)';
  });
  let me2 = document.querySelector('.header .header__fig_2');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    me2.style.transform = 'translate(-' + x * 80 + 'px, +' + y * 80 + 'px)';
  });
  let mi = document.querySelector('.header .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    mi.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let mz1 = document.querySelector('.header .header__fig_4');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    mz1.style.transform = 'translate(-' + x * 80 + 'px, -' + y * 50 + 'px)';
  });

  // let te1 = document.querySelector('.main .header__fig_1');
  // window.addEventListener('mousemove', function (e) {
  //   let x = e.clientX / window.innerWidth;
  //   let y = e.clientY / window.innerHeight;
  //   te1.style.transform = 'translate(-' + x * 80 + 'px, -' + y * 80 + 'px)';
  // });
  let tee1 = document.querySelector('.main .header__fig_2');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    tee1.style.transform = 'translate(-' + x * 80 + 'px, -' + y * 80 + 'px)';
  });
  let te3 = document.querySelector('.main .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te3.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });

  let te4 = document.querySelector('.main .header__fig_4');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te4.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let te5 = document.querySelector('.test .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te5.style.transform = 'translate(-' + x * 20 + 'px, -' + y * 20 + 'px)';
  });
  let te6 = document.querySelector('.van .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te6.style.transform = 'translate(' + x * 50 + 'px, -' + y * 70 + 'px)';
  });
  let tee6 = document.querySelector('.van .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    tee6.style.transform = 'translate(' + x * 50 + 'px, -' + y * 70 + 'px)';
  });
  let te7 = document.querySelector('.van .header__fig_4');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te7.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
  });

  let te8 = document.querySelector('.per .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te8.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let te9 = document.querySelector('.per .header__fig_2');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te9.style.transform = 'translate(' + x * 50 + 'px, -' + y * 70 + 'px)';
  });
  let te10 = document.querySelector('.per .header__fig_4');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te10.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let te11 = document.querySelector('.par .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te11.style.transform = 'translate(' + x * 50 + 'px, -' + y * 70 + 'px)';
  });
  let te12 = document.querySelector('.par .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te12.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let te13 = document.querySelector('.about .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te13.style.transform = 'translate(' + x * 50 + 'px, -' + y * 70 + 'px)';
  });
  let te14 = document.querySelector('.about .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te14.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let te15 = document.querySelector('.test1 .header__fig_1');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    te15.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  // let te16 = document.querySelector('.test2 .header__fig_1');
  // window.addEventListener('mousemove', function (e) {
  //   let x = e.clientX / window.innerWidth;
  //   let y = e.clientY / window.innerHeight;
  //   te16.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
  // });
  let tee16 = document.querySelector('.area .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    tee16.style.transform = 'translate(' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let tet16 = document.querySelector('.per .header__fig_3');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    tet16.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
  });
  let ter16 = document.querySelector('.about .header__fig_2');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    ter16.style.transform = 'translate(' + x * 80 + 'px, -' + y * 50 + 'px)';
  });
  let tes16 = document.querySelector('.about .header__fig_4');
  window.addEventListener('mousemove', function (e) {
    let x = e.clientX / window.innerWidth;
    let y = e.clientY / window.innerHeight;
    tes16.style.transform = 'translate(-' + x * 20 + 'px, -' + y * 50 + 'px)';
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $('.articmodal-close').click(function (e) {
    $.arcticmodal('close');

  });
  $('.test__btn_2').click(function (e) {
    e.preventDefault();
    $('#popup-call').arcticmodal({
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    $('[data-submit1]').on('click', function (e) {
      e.preventDefault();
      $(this).parents('form').submit();
    })
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
    function valEl(el) {

      el.validate({
        rules: {
          tel: {
            required: true,
            regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
          },
          name: {
            required: true
          },
          pass: {
            required: true
          },
          login: {
            required: true
          },
          text: {
            required: true
          },
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          tel: {
            required: 'Поле обязательно для заполнения',
            regex: 'Телефон может содержать символы + - ()'
          },
          name: {
            required: 'Поле обязательно для заполнения',
          },
          login: {
            required: 'Поле обязательно для заполнения',
          },
          pass: {
            required: 'Поле обязательно для заполнения',
          },
          email: {
            required: 'Поле обязательно для заполнения',
            email: 'Неверный формат E-mail'
          }
        },
        submitHandler: function (form) {
          $('#loader').fadeIn();
          var $form = $(form);
          var $formId = $(form).attr('id');
          switch ($formId) {
            case 'popupResult':
              $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
              })
                .always(function (response) {
                  setTimeout(function () {
                    $('#loader').fadeOut();
                  }, 800);
                  setTimeout(function () {
                    $.arcticmodal('close');
                    $('#popup-thank').arcticmodal({});
                    $form.trigger('reset');
                    //строки для остлеживания целей в Я.Метрике и Google Analytics
                  }, 1100);

                });
              break;
          }
          return false;
        }
      })
    }

    $('.js-form1').each(function () {
      valEl($(this));
    });
    $('[data-scroll]').on('click', function () {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'data-scroll')).offset().top
      }, 2000);
      event.preventDefault();
    })
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    $('[data-submit2]').on('click', function (e) {
      e.preventDefault();
      $(this).parents('form').submit();
    })
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
    function valEl(el) {

      el.validate({
        rules: {
          tel: {
            required: true,
            regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
          },
          name: {
            required: true
          },
          pass: {
            required: true
          },
          login: {
            required: true
          },
          text: {
            required: true
          },
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          tel: {
            required: 'Поле обязательно для заполнения',
            regex: 'Телефон может содержать символы + - ()'
          },
          name: {
            required: 'Поле обязательно для заполнения',
          },
          login: {
            required: 'Поле обязательно для заполнения',
          },
          pass: {
            required: 'Поле обязательно для заполнения',
          },
          email: {
            required: 'Поле обязательно для заполнения',
            email: 'Неверный формат E-mail'
          }
        },
        submitHandler: function (form) {
          $('#loader').fadeIn();
          var $form = $(form);
          var $formId = $(form).attr('id');
          switch ($formId) {
            case 'popupResult2':
              $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
              })
                .always(function (response) {
                  setTimeout(function () {
                    $('#loader').fadeOut();
                  }, 800);
                  setTimeout(function () {
                    $.arcticmodal('close');
                    $('#popup-thank').arcticmodal({});
                    $form.trigger('reset');
                    //строки для остлеживания целей в Я.Метрике и Google Analytics
                  }, 1100);

                });
              break;
          }
          return false;
        }
      })
    }

    $('.js-form2').each(function () {
      valEl($(this));
    });
    $('[data-scroll]').on('click', function () {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'data-scroll')).offset().top
      }, 2000);
      event.preventDefault();
    })
  });
});
document.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    $('[data-submit3]').on('click', function (e) {
      e.preventDefault();
      $(this).parents('form').submit();
    })
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
    function valEl(el) {

      el.validate({
        rules: {
          tel: {
            required: true,
            regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
          },
          name: {
            required: true
          },
          pass: {
            required: true
          },
          login: {
            required: true
          },
          text: {
            required: true
          },
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          tel: {
            required: 'Поле обязательно для заполнения',
            regex: 'Телефон может содержать символы + - ()'
          },
          name: {
            required: 'Поле обязательно для заполнения',
          },
          login: {
            required: 'Поле обязательно для заполнения',
          },
          pass: {
            required: 'Поле обязательно для заполнения',
          },
          email: {
            required: 'Поле обязательно для заполнения',
            email: 'Неверный формат E-mail'
          }
        },
        submitHandler: function (form) {
          $('#loader').fadeIn();
          var $form = $(form);
          var $formId = $(form).attr('id');
          switch ($formId) {
            case 'popupResult3':
              $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
              })
                .always(function (response) {
                  setTimeout(function () {
                    $('#loader').fadeOut();
                  }, 800);
                  setTimeout(function () {
                    $.arcticmodal('close');
                    $('#popup-thank').arcticmodal({});
                    $form.trigger('reset');
                    //строки для остлеживания целей в Я.Метрике и Google Analytics
                  }, 1100);

                });
              break;
          }
          return false;
        }
      })
    }

    $('.js-form3').each(function () {
      valEl($(this));
    });
    $('[data-scroll]').on('click', function () {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'data-scroll')).offset().top
      }, 2000);
      event.preventDefault();
    })
  });
});
document.addEventListener("DOMContentLoaded", () => {
  let menuBtn = document.querySelector('.menu-btn');
  let menu = document.querySelector('.menu');
  menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    menu.classList.toggle('active');
  });
});
document.addEventListener("DOMContentLoaded", () => {
  $('.menu li a').click(function (event) {
    $('.menu-btn').toggleClass('active');
    $('.menu').toggleClass('active');
    return false;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Scroll
  $('.go_to').click(function () { // ловим клик по ссылке с классом go_to
    var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href, должен быть селектором, т.е. например начинаться с # или .
    if ($(scroll_el).length != 0) { // проверим существование элемента чтобы избежать ошибки
      $('html, body').animate({ scrollTop: $(scroll_el).offset().top - 100 }, 800); // анимируем скроолинг к элементу scroll_el
    }
    return false; // выключаем стандартное действие
  });
});
document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $(".youtube-link").grtyoutube({
      autoPlay: true
    });
  });

  (function ($) {

    $.fn.grtyoutube = function (options) {

      return this.each(function () {

        // Get video ID
        var getvideoid = $(this).attr("youtubeid");

        // Default options
        var settings = $.extend({
          videoID: getvideoid,
          autoPlay: true
        }, options);

        // Convert some values
        if (settings.autoPlay === true) { settings.autoPlay = 1 } else { settings.autoPlay = 0 }

        // Initialize on click
        if (getvideoid) {
          $(this).on("click", function () {
            $("body").append('<div class="grtvideo-popup">' +
              '<div class="grtvideo-popup-content">' +
              '<span class="grtvideo-popup-close">&times;</span>' +
              '<iframe class="grtyoutube-iframe" src="https://www.youtube.com/embed/' + settings.videoID + '?rel=0&wmode=transparent&autoplay=' + settings.autoPlay + '&iv_load_policy=3" allowfullscreen frameborder="0"></iframe>' +
              '</div>' +
              '</div>');
          });
        }

        // Close the box on click or escape
        $(this).on('click', function (event) {
          event.preventDefault();
          $(".grtvideo-popup-close, .grtvideo-popup").click(function () {
            $(".grtvideo-popup").remove();
          });
        });

        $(document).keyup(function (event) {
          if (event.keyCode == 27) {
            $(".grtvideo-popup").remove();
          }
        });
      });
    };
  }(jQuery));
});
document.addEventListener("DOMContentLoaded", () => {
  // svg
  $(function () {
    jQuery('img.svg').each(function () {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, else we gonna set it if we can.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

      }, 'xml');

    });
  });
});
