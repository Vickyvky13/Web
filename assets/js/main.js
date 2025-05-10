
/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if(navToggle && navMenu){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
if(navClose && navMenu){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    if(navMenu) {
        navMenu.classList.remove('show-menu')
    }
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== HOME SWIPER ===============*/
const homeSwiper = document.querySelector('.home-swiper')
if(homeSwiper) {
    let swiper = new Swiper(homeSwiper, {
        spaceBetween: 30,
        loop: 'true',
        
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    })
}

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    if(header) {
        if(this.scrollY >= 50) header.classList.add('scroll-header'); 
        else header.classList.remove('scroll-header')
    }
}
window.addEventListener('scroll', scrollHeader)

/*=============== NEW SWIPER ===============*/
const newSwiper = document.querySelector('.new-swiper')
if(newSwiper) {
    let swiper = new Swiper(newSwiper, {
        centeredSlides: true,
        slidesPerView: "auto",
        loop: 'true',
        spaceBetween: 16,
    })
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')
        
        const menuItem = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        if(menuItem) {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                menuItem.classList.add('active-link')
            }else{
                menuItem.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    if(scrollUp) {
        if(this.scrollY >= 460) scrollUp.classList.add('show-scroll');
        else scrollUp.classList.remove('show-scroll')
    }
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
})

sr.reveal(`.home-swiper, .new-swiper, .newsletter__container`)
sr.reveal(`.category__data, .trick__content, .footer__content`,{interval: 100})
sr.reveal(`.about__data, .discount__img`,{origin: 'left'})
sr.reveal(`.about__img, .discount__data`,{origin: 'right'})
