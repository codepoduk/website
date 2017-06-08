const CodePod = {
  toggleMenu() {
    this.menu.classList.toggle('open');
    this.menuHamburger.classList.toggle('open');
  },
  validateInput(input) {
    if ([...input.classList].includes('email')) {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailRegex.test(input.value)) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        return true;
      } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        return false;
      }
    } else if (input.value == '') {
      input.classList.remove('valid');
      input.classList.add('invalid');
      return false;
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
      return true;
    }
  },
  formIsValid() {
    const isValid = [...this.contactForm.children]
      .filter(el => [...el.classList].includes('form-data'))
      .map(el => this.validateInput(el));
    return isValid.every((valid) => valid);
  },
  saveDataSuccess() {
    this.contactForm.children['submit-button'].innerHTML = 'Submit';
    this.contactForm.children['submit-feedback'].innerHTML = '<strong class="green">Message sent!</strong>';
    [...this.contactForm.children]
      .filter(el => [...el.classList].includes('form-data'))
      .forEach(el => {
        el.classList.toggle('sending');
        el.classList.remove('valid');
        el.classList.remove('invalid');
        el.value = '';
      });
  },
  saveDataFailure() {
    [...this.contactForm.children]
      .filter(el => [...el.classList].includes('form-data'))
      .forEach(el => el.classList.toggle('sending'));
    this.contactForm.children['submit-button'].innerHTML = 'Submit';
    this.contactForm.children['submit-feedback'].innerHTML = '<strong class="red">Message failed :(</strong> Email us at <a class="blue" href="mailto:codepoduk@gmail.com">codepoduk@gmail.com</a>';
  },
  sendDataToFirebase(data) {
    this.contactForm.children['submit-button'].innerHTML = 'Sending...';
    this.contactForm.children['submit-feedback'].innerHTML = '';
    [...this.contactForm.children]
      .filter(el => [...el.classList].includes('form-data'))
      .forEach(el => el.classList.toggle('sending'));
    firebase.database().ref('messages').set(data)
      .then(() => this.saveDataSuccess())
      .catch(() => this.saveDataFailure());
  },
  getDataFromForm() {
    const data = {};
    const message = [...this.contactForm.children]
      .filter(el => [...el.classList].includes('form-data'))
      .reduce((message, el) => {
        message[el.name] = el.value;
        return message;
      }, {});
    message.timeSent = +new Date();
    const id = md5(message.timeSent + message.name);
    data[id] = message;
    return data;
  },
  onInputChange(event) {
    if (event.target.className.indexOf('form-data') !== -1) {
      this.validateInput(event.target);
    }
  },
  onSubmitForm(event) {
    event.preventDefault();
    if (event.target.id === 'submit-button') {
      if (!this.formIsValid()) {
        return;
      } else {
        const data = this.getDataFromForm();
        this.sendDataToFirebase(data);
      }
    }
  },
  onMenuClick(event) {
    const clicked = event.target;
    const menuClicked = [...clicked.classList].some((className) => {
      return className === 'menu__hamburger-icon' || className === 'menu__hamburger-icon__block';
    });
    const menuItemClicked = [...clicked.classList].includes('menu__item') || [...clicked.parentNode.classList].includes('menu__item');
    if (menuClicked) {
      this.toggleMenu();
    } else if (menuItemClicked) {
      const hash = clicked.hash || clicked.firstElementChild.hash;
      if (hash) {
        const scrollPos = document.getElementById(hash.replace('#', '')).offsetTop;
        event.preventDefault();
        this.toggleMenu();
        window.scrollTo(0, scrollPos - 76);
      }
    }
  },
  bindEvents() {
    this.header.addEventListener('click', this.onMenuClick.bind(this));
    this.contactForm.addEventListener('click', this.onSubmitForm.bind(this));
    this.contactForm.addEventListener('keyup', this.onInputChange.bind(this));
  },
  init() {
    this.header = document.querySelector('.header');
    this.menu = document.querySelector('.header .menu');
    this.menuHamburger = document.querySelector('.menu__hamburger-icon');
    this.contactForm = document.getElementById('contact-form');

    this.bindEvents();
  },
};

CodePod.init();
