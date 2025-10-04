function nextPage(i){
    const from = document.getElementById("Section"+i);
    const to = document.getElementById("Section"+(i+1));

    const text1 = document.getElementById("bgText"+i);
    const text2 = document.getElementById("bgText"+(i+1));

    from.style.transition = "all 1s cubic-bezier(.31,.01,.66,-0.59)";
    to.style.transition = "all 1s cubic-bezier(.33,1.53,.69,.99)";
    from.style.transform = "translateX(-100%) rotate(-90deg)";
    from.style.filter = "blur(50px)";
    setTimeout(() => {
        text1.style.transform = "translateX(-100%)";
    }, 500);
    setTimeout(() => {
        from.style.display = "none";
        to.style.display = "flex";
        text2.style.transform = "translateX(0)";
    }, 1500);
    setTimeout(() => {
        to.style.transform = "translateX(0%) rotate(0deg)";
        to.style.filter = "blur(0)";
    }, 2000);
}

function prevPage(i){
    const from = document.getElementById("Section"+(i+1));
    const to = document.getElementById("Section"+i);

    const text1 = document.getElementById("bgText"+(i+1));
    const text2 = document.getElementById("bgText"+i);

    from.style.transition = "all 1s cubic-bezier(.31,.01,.66,-0.59)";
    to.style.transition = "all 1s cubic-bezier(.33,1.53,.69,.99)";
    from.style.transform = "translateX(100%) rotate(90deg)";
    from.style.filter = "blur(50px)";
    setTimeout(() => {
        text1.style.transform = "translateX(100%)";
    }, 500);
    setTimeout(() => {
        from.style.display = "none";
        to.style.display = "flex";
        text2.style.transform = "translateX(0)";
    }, 1500);
    setTimeout(() => {
        to.style.transform = "translateX(0%) rotate(0deg)";
        to.style.filter = "blur(0)";
    }, 2000);
}

const menuScorller = document.getElementById("menuScroller");
const readmoreBtns = document.getElementsByClassName("readmore");

let imgNum = [3, 3, 3, 3, 5, 3, 3, 3, 3, 23, 2, 4, 5, 15, 3, 7, 6, 16];

document.addEventListener("DOMContentLoaded", () => {
    for(let i = 0; i < 18; i++){
        
        const menuScrollerItem = document.createElement("div");
        menuScrollerItem.classList.add("menuScrollerItem");
        menuScorller.appendChild(menuScrollerItem);
        readmoreBtns[i].onclick = () => {readmore(i+1)};
    }

    for(let i = 0; i < 18; i++){
        const ch = document.getElementById("ch"+(i+1));
        if(i >= 0 && i <= 3){
            ch.classList.remove("focusCh", "unfocusCh");
            ch.classList.add("focusCh");
        }
        else{
            ch.classList.remove("focusCh", "unfocusCh");
            ch.classList.add("unfocusCh");
        }
    }
});

const chContainer = document.getElementById("chContainer");

menuScorller.addEventListener("scroll", () => {
    let scrollRatio = menuScorller.scrollTop / menuScorller.scrollHeight;
    let vx = -scrollRatio * 400 * 18;
    let vx2 = scrollRatio * 1500;
    let index = Math.round(scrollRatio * 18);
    
    chContainer.style.transform = `translateX(${vx}px)`;
    scrollBar.style.marginLeft = vx2 + "px";

    for(let i = 0; i < 18; i++){
        const ch = document.getElementById("ch"+(i+1));
        if(i >= index && i <= index + 3){
            ch.classList.remove("focusCh", "unfocusCh");
            ch.classList.add("focusCh");
        }
        else{
            ch.classList.remove("focusCh", "unfocusCh");
            ch.classList.add("unfocusCh");
        }
    }
});

const scrollBar = document.getElementById("scrollBar");
const scrollBarBG = document.getElementById("scrollBarBG");

let isDragging = false;
let startX = 0;
let startScrollLeft = 0;

scrollBar.addEventListener("mousedown", (e) => {
    if(!isOpen){
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startScrollLeft = menuScorller.scrollTop;
        scrollBar.style.cursor = "grabbing";
    }
});

document.addEventListener("mousemove", (e) => {
    if(!isDragging || isOpen) return;
    
    e.preventDefault();
    const deltaX = e.clientX - startX;
    const scrollRatio = deltaX / 1500;
    menuScorller.scrollTop = startScrollLeft + (scrollRatio * menuScorller.scrollHeight);
});

document.addEventListener("mouseup", () => {
    if(isDragging){
        isDragging = false;
        scrollBar.style.cursor = "grab";
    }
});

scrollBarBG.addEventListener("click", (e) => {
    if(!isOpen && e.target === scrollBarBG){
        const rect = scrollBarBG.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const scrollRatio = clickX / 1500;
        menuScorller.scrollTop = scrollRatio * menuScorller.scrollHeight;
    }
});

let isOpen = false;
let imgLoopTimer;
let tempN = 0;
let imgH;
let tempI;
let isSwitching = false;

chContainer.addEventListener("wheel", (e) => {
    if(!isOpen){
        e.preventDefault();
        menuScorller.scrollTop += e.deltaY*(1080/400);
    }
}, { passive: false });

async function loadContent(content, i) {
    try {
        const response = await fetch(`/get-content/${i}`);
        const text = await response.text();
        content.innerText = text;
    } catch (error) {
        console.error('讀取文件失敗:', error);
        content.innerText = '無法載入內容，請使用node.js啟動server.js';
    }
}

function readmore(i) {
    let index = Math.round(menuScorller.scrollTop/menuScorller.scrollHeight*18);
    const scrollBarBG = document.getElementById("scrollBarBG");
    const backBtn = document.getElementById("backBtn");
    const menuContainer = document.getElementById("menuContainer");
    let ch1, ch2, ch3, ch4, ch5, bg, title, subtitle, icon, closeBtn, slide1, slide2, nextBtn, content, fullscreenBtn, fullscreenImagesG, fullscreenImagesContainer;
    tempI = i;
    isOpen = true;

    bg = document.getElementById("ch"+i+"_bg");
    title = document.getElementById("ch"+i+"_title");
    subtitle = document.getElementById("ch"+i+"_subtitle");
    icon = document.getElementById("ch"+i+"_icon");
    closeBtn = document.getElementById("close"+i);
    slide1 = document.getElementById("ch"+i+"_slide_1");
    slide2 = document.getElementById("ch"+i+"_slide_2");
    content = document.getElementById("ch_content");
    fullscreenBtn = document.getElementById("ch_fullscreenBtn");
    fullscreenImagesContainer = document.getElementById("fullscreenImagesContainer");
    fullscreenImagesG = document.getElementsByClassName("fullscreenImagesG");
    loadContent(content,i);

    if(i < 18){
        nextBtn = document.getElementById("ch_next"+i);
        nextBtn.style.transitionDuration = "1s";
    }

    bg.style.transitionDuration = "1.5s";
    title.style.transitionDuration = "1.5s";
    subtitle.style.transitionDuration = "1.5s";
    icon.style.transitionDuration = "1.5s";
    closeBtn.style.transitionDuration = "1.5s";
    backBtn.style.transitionDuration = "1.5s";
    fullscreenImagesG[0].style.transitionDuration = "0s";
    fullscreenImagesG[1].style.transitionDuration = "0s";

    backBtn.style.scale = 0;
    scrollBarBG.style.transform = "translateY(400px)";

    menuScorller.style.pointerEvents = "none";
    

    switch (index - i){
        case -1:
            if(i+4 <= 18){
                ch5 = document.getElementById("ch"+(i+4));
                ch5.style.transform = "translateY(1080px)";
                ch5.style.opacity = 0;
                ch5.style.filter = "blur(30px)";
            }
            ch1 = document.getElementById("ch"+i);
            ch2 = document.getElementById("ch"+(i+1));
            ch3 = document.getElementById("ch"+(i+2));
            ch4 = document.getElementById("ch"+(i+3));
            
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            
            setTimeout(() => {
                ch2.style.transform = "translateY(1080px)";
                ch2.style.opacity = 0;
                ch2.style.filter = "blur(30px)";

                ch1.classList.remove("chapters");
                ch1.classList.add("chaptersOpen");
                
                bg.style.width = "2000px";
                bg.style.height = "2000px";
                bg.style.marginLeft = "1800px";
                bg.style.marginTop = "1200px";
                bg.style.borderRadius = "160px";

                title.style.fontSize = "100px";
                title.style.marginLeft = "1600px";
                title.style.marginTop = "-600px";
                title.style.scale = "1 0";
                title.style.filter = "blur(30px)";
                title.style.opacity = 0;

                subtitle.style.fontSize = "80px";
                subtitle.style.marginLeft = "2400px";
                subtitle.style.marginTop = "-500px";
                subtitle.style.width = "1000px";

                icon.style.width = "600px";
                icon.style.maxHeight = "800px";
                icon.style.borderRadius = "60px";
                icon.style.marginLeft = "600px";
                icon.style.marginTop = "300px";

                


                fullscreenImagesG[0].style.width = icon.style.width;
                fullscreenImagesG[1].style.width = icon.style.width;

                closeBtn.style.display = "block";
                slide1.style.display = "block";
                slide2.style.display = "block";
                nextBtn.style.display = "block";
                content.style.display = "block";
                fullscreenBtn.style.display = "flex";
                

            }, 500);
            setTimeout(() => {
                ch3.style.transform = "translateY(1080px)";
                ch3.style.opacity = 0;
                ch3.style.filter = "blur(30px)";
            }, 600);
            setTimeout(() => {
                ch4.style.transform = "translateY(1080px)";
                ch4.style.opacity = 0;
                ch4.style.filter = "blur(30px)";
            }, 700);
            setTimeout(() => {
                closeBtn.style.marginLeft = "3000px";
                closeBtn.style.opacity = 1;
                closeBtn.style.filter = "blur(0)";
                closeBtn.onclick = () => {closeCh(i)};
            }, 1000);
            setTimeout(() => {
                menuContainer.style.maskMode = "unset";
                nextBtn.style.marginTop = "800px";
                nextBtn.style.opacity = 1;
                nextBtn.style.filter = "blur(0)";
                nextBtn.onclick = () => {nextBtnCh(i)};
            }, 1200);

            setTimeout(() => {
                slide2.style.marginTop = "460px";
                slide2.style.opacity = 0.3;
                slide2.style.filter = "blur(0)";
            }, 1400);
            setTimeout(() => {
                slide1.style.marginTop = "-100px";
                slide1.style.opacity = 1;
                slide1.style.filter = "blur(0)";
                closeBtn.style.transitionDuration = "0.2s";
                if(i<18){
                    nextBtn.style.transitionDuration = "0.2s";
                }
                content.style.opacity = 1;
                content.style.filter = "blur(0)";
            }, 1600);
            setTimeout(() => {
                fullscreenBtn.style.opacity = 1;
                fullscreenBtn.style.filter = "blur(0)";
                fullscreenImagesContainer.style.display = "flex";
                fullscreenImagesG[0].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[1].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[0].style.zIndex = imgNum[i-1]+7;
                fullscreenImagesG[1].style.zIndex = imgNum[i-1]+8;
                imgH = icon.children[0].offsetHeight;
                fullscreenImagesG[0].style.height = imgH + "px";
                fullscreenImagesG[1].style.height = imgH + "px";
                icon.style.opacity = 0;
                tempN = 0;
                imgLoopTimer = setInterval(() => {
                    fullscreenImgLoop(i);
                }, 3000);
            }, 2000);
            break;
        case -2:
            if(i+3 <= 18){
                ch5 = document.getElementById("ch"+(i+3));
                ch5.style.transform = "translateY(1080px)";
                ch5.style.opacity = 0;
                ch5.style.filter = "blur(30px)";
            }
            ch1 = document.getElementById("ch"+(i-1));
            ch2 = document.getElementById("ch"+i);
            ch3 = document.getElementById("ch"+(i+1));
            ch4 = document.getElementById("ch"+(i+2));

            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            setTimeout(() => {
                ch1.style.transform = "translateY(1080px)";
                ch1.style.opacity = 0;
                ch1.style.filter = "blur(30px)";
                ch3.style.transform = "translateY(1080px)";
                ch3.style.opacity = 0;
                ch3.style.filter = "blur(30px)";

                ch2.classList.remove("chapters");
                ch2.classList.add("chaptersOpen");
                ch2.style.transform = "translateX(-400px)";
                
                bg.style.width = "2000px";
                bg.style.height = "2000px";
                bg.style.marginLeft = "1800px";
                bg.style.marginTop = "1200px";
                bg.style.borderRadius = "160px";

                title.style.fontSize = "100px";
                title.style.marginLeft = "1600px";
                title.style.marginTop = "-600px";
                title.style.scale = "1 0";
                title.style.filter = "blur(30px)";
                title.style.opacity = 0;

                subtitle.style.fontSize = "80px";
                subtitle.style.marginLeft = "2400px";
                subtitle.style.marginTop = "-500px";
                subtitle.style.width = "1000px";

                icon.style.width = "600px";
                icon.style.maxHeight = "800px";
                icon.style.borderRadius = "60px";
                icon.style.marginLeft = "600px";
                icon.style.marginTop = "300px";

                fullscreenImagesG[0].style.transitionDuration = 0;
                fullscreenImagesG[1].style.transitionDuration = 0;

                fullscreenImagesG[0].style.width = icon.style.width;
                fullscreenImagesG[1].style.width = icon.style.width;


                closeBtn.style.display = "block";
                slide1.style.display = "block";
                slide2.style.display = "block";
                nextBtn.style.display = "block";
                content.style.display = "block";
                fullscreenBtn.style.display = "flex";
            }, 500);
            setTimeout(() => {
                ch4.style.transform = "translateY(1080px)";
                ch4.style.opacity = 0;
                ch4.style.filter = "blur(30px)";
                
            }, 600);
            setTimeout(() => {
                closeBtn.style.marginLeft = "3000px";
                closeBtn.style.opacity = 1;
                closeBtn.style.filter = "blur(0)";
                closeBtn.onclick = () => {closeCh(i)};
            }, 1000);
            setTimeout(() => {
                menuContainer.style.maskMode = "unset";
                nextBtn.style.marginTop = "800px";
                nextBtn.style.opacity = 1;
                nextBtn.style.filter = "blur(0)";
                nextBtn.onclick = () => {nextBtnCh(i)};
            }, 1200);

            setTimeout(() => {
                slide2.style.marginTop = "460px";
                slide2.style.opacity = 0.3;
                slide2.style.filter = "blur(0)";
            }, 1400);
            setTimeout(() => {
                slide1.style.marginTop = "-100px";
                slide1.style.opacity = 1;
                slide1.style.filter = "blur(0)";
                closeBtn.style.transitionDuration = "0.2s";
                if(i<18){
                    nextBtn.style.transitionDuration = "0.2s";
                }
                content.style.opacity = 1;
                content.style.filter = "blur(0)";
            }, 1600);
            setTimeout(() => {
                fullscreenBtn.style.opacity = 1;
                fullscreenBtn.style.filter = "blur(0)";
                fullscreenImagesContainer.style.display = "flex";
                fullscreenImagesG[0].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[1].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[0].style.zIndex = imgNum[i-1]+7;
                fullscreenImagesG[1].style.zIndex = imgNum[i-1]+8;
                imgH = icon.children[0].offsetHeight;
                fullscreenImagesG[0].style.height = imgH + "px";
                fullscreenImagesG[1].style.height = imgH + "px";
                icon.style.opacity = 0;
                tempN = 0;
                imgLoopTimer = setInterval(() => {
                    fullscreenImgLoop(i);
                }, 3000);
            }, 2000);
            
            break;
        case -3:
            if(i+2 <= 18){
                ch5 = document.getElementById("ch"+(i+2));
                ch5.style.transform = "translateY(1080px)";
                ch5.style.opacity = 0;
                ch5.style.filter = "blur(30px)";
            }
            ch1 = document.getElementById("ch"+(i-2));
            ch2 = document.getElementById("ch"+(i-1));
            ch3 = document.getElementById("ch"+i);
            ch4 = document.getElementById("ch"+(i+1));
            
            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            setTimeout(() => {
                ch2.style.transform = "translateY(1080px)";
                ch2.style.opacity = 0;
                ch2.style.filter = "blur(30px)";
                ch4.style.transform = "translateY(1080px)";
                ch4.style.opacity = 0;
                ch4.style.filter = "blur(30px)";

                ch3.classList.remove("chapters");
                ch3.classList.add("chaptersOpen");
                ch3.style.transform = "translateX(-800px)";
                
                bg.style.width = "2000px";
                bg.style.height = "2000px";
                bg.style.marginLeft = "1800px";
                bg.style.marginTop = "1200px";
                bg.style.borderRadius = "160px";

                title.style.fontSize = "100px";
                title.style.marginLeft = "1600px";
                title.style.marginTop = "-600px";
                title.style.scale = "1 0";
                title.style.filter = "blur(30px)";
                title.style.opacity = 0;

                subtitle.style.fontSize = "80px";
                subtitle.style.marginLeft = "2400px";
                subtitle.style.marginTop = "-500px";
                subtitle.style.width = "1000px";

                icon.style.width = "600px";
                icon.style.maxHeight = "800px";
                icon.style.borderRadius = "60px";
                icon.style.marginLeft = "600px";
                icon.style.marginTop = "300px";

                fullscreenImagesG[0].style.transitionDuration = 0;
                fullscreenImagesG[1].style.transitionDuration = 0;

                fullscreenImagesG[0].style.width = icon.style.width;
                fullscreenImagesG[1].style.width = icon.style.width;


                closeBtn.style.display = "block";
                slide1.style.display = "block";
                slide2.style.display = "block";
                nextBtn.style.display = "block";
                content.style.display = "block";
                fullscreenBtn.style.display = "flex";
                

            }, 500);
            setTimeout(() => {
                ch1.style.transform = "translateY(1080px)";
                ch1.style.opacity = 0;
                ch1.style.filter = "blur(30px)";
            }, 600);
            setTimeout(() => {
                closeBtn.style.marginLeft = "3000px";
                closeBtn.style.opacity = 1;
                closeBtn.style.filter = "blur(0)";
                closeBtn.onclick = () => {closeCh(i)};
                menuContainer.style.maskMode = "unset";
            }, 1000);
            setTimeout(() => {
                nextBtn.style.marginTop = "800px";
                nextBtn.style.opacity = 1;
                nextBtn.style.filter = "blur(0)";
                nextBtn.onclick = () => {nextBtnCh(i)};
            }, 1200);

            setTimeout(() => {
                slide2.style.marginTop = "460px";
                slide2.style.opacity = 0.3;
                slide2.style.filter = "blur(0)";
            }, 1400);
            setTimeout(() => {
                slide1.style.marginTop = "-100px";
                slide1.style.opacity = 1;
                slide1.style.filter = "blur(0)";
                closeBtn.style.transitionDuration = "0.2s";
                if(i<18){
                    nextBtn.style.transitionDuration = "0.2s";
                }
                content.style.opacity = 1;
                content.style.filter = "blur(0)";
            }, 1600);
            setTimeout(() => {
                fullscreenBtn.style.opacity = 1;
                fullscreenBtn.style.filter = "blur(0)";
                fullscreenImagesContainer.style.display = "flex";
                fullscreenImagesG[0].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[1].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[0].style.zIndex = imgNum[i-1]+7;
                fullscreenImagesG[1].style.zIndex = imgNum[i-1]+8;
                imgH = icon.children[0].offsetHeight;
                fullscreenImagesG[0].style.height = imgH + "px";
                fullscreenImagesG[1].style.height = imgH + "px";
                icon.style.opacity = 0;
                tempN = 0;
                imgLoopTimer = setInterval(() => {
                    fullscreenImgLoop(i);
                }, 3000);
            }, 2000);
            break;
        case -4:
            if(i+1 <= 18){
                ch5 = document.getElementById("ch"+(i+1));
                ch5.style.transform = "translateY(1080px)";
                ch5.style.opacity = 0;
                ch5.style.filter = "blur(30px)";
            }
            ch1 = document.getElementById("ch"+(i-3));
            ch2 = document.getElementById("ch"+(i-2));
            ch3 = document.getElementById("ch"+(i-1));
            ch4 = document.getElementById("ch"+i);
            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            
            setTimeout(() => {
                ch3.style.transform = "translateY(1080px)";
                ch3.style.opacity = 0;
                ch3.style.filter = "blur(30px)";

                ch4.classList.remove("chapters");
                ch4.classList.add("chaptersOpen");
                ch4.style.transform = "translateX(-1200px)";
                
                bg.style.width = "2000px";
                bg.style.height = "2000px";
                bg.style.marginLeft = "1800px";
                bg.style.marginTop = "1200px";
                bg.style.borderRadius = "160px";

                title.style.fontSize = "100px";
                title.style.marginLeft = "1600px";
                title.style.marginTop = "-600px";
                title.style.scale = "1 0";
                title.style.filter = "blur(30px)";
                title.style.opacity = 0;

                subtitle.style.fontSize = "80px";
                subtitle.style.marginLeft = "2400px";
                subtitle.style.marginTop = "-500px";
                subtitle.style.width = "1000px";

                icon.style.width = "600px";
                icon.style.maxHeight = "800px";
                icon.style.borderRadius = "60px";
                icon.style.marginLeft = "600px";
                icon.style.marginTop = "300px";

                fullscreenImagesG[0].style.transitionDuration = 0;
                fullscreenImagesG[1].style.transitionDuration = 0;

                fullscreenImagesG[0].style.width = icon.style.width;
                fullscreenImagesG[1].style.width = icon.style.width;


                closeBtn.style.display = "block";
                slide1.style.display = "block";
                slide2.style.display = "block";
                if(i<18){
                    nextBtn.style.display = "block";
                }
                content.style.display = "block";
                fullscreenBtn.style.display = "flex";

            }, 500);
            setTimeout(() => {
                ch2.style.transform = "translateY(1080px)";
                ch2.style.opacity = 0;
                ch2.style.filter = "blur(30px)";
            }, 600);
            setTimeout(() => {
                ch1.style.transform = "translateY(1080px)";
                ch1.style.opacity = 0;
                ch1.style.filter = "blur(30px)";
                menuContainer.style.maskMode = "unset";
            }, 700);
            setTimeout(() => {
                closeBtn.style.marginLeft = "3000px";
                closeBtn.style.opacity = 1;
                closeBtn.style.filter = "blur(0)";
                closeBtn.onclick = () => {closeCh(i)};
            }, 1000);
            setTimeout(() => {
                if(i<18){
                    nextBtn.style.marginTop = "800px";
                    nextBtn.style.opacity = 1;
                    nextBtn.style.filter = "blur(0)";
                    nextBtn.onclick = () => {nextBtnCh(i)};
                }
            }, 1200);

            setTimeout(() => {
                slide2.style.marginTop = "460px";
                slide2.style.opacity = (i<18) ? 0.3 : 1;
                slide2.style.fontSize = (i<18)? "" : "";
                slide2.style.filter = "blur(0)";
            }, 1400);
            setTimeout(() => {
                slide1.style.marginTop = "-100px";
                slide1.style.opacity = (i<18) ? 1 : 0.3;
                slide1.style.filter = "blur(0)";
                closeBtn.style.transitionDuration = "0.2s";
                if(i<18){
                    nextBtn.style.transitionDuration = "0.2s";
                }
                content.style.opacity = 1;
                content.style.filter = "blur(0)";
            }, 1600);
            setTimeout(() => {
                fullscreenBtn.style.opacity = 1;
                fullscreenBtn.style.filter = "blur(0)";
                fullscreenImagesContainer.style.display = "flex";
                fullscreenImagesG[0].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[1].children[0].src = `../img/work/${i}-1.jpg`;
                fullscreenImagesG[0].style.zIndex = imgNum[i-1]+7;
                fullscreenImagesG[1].style.zIndex = imgNum[i-1]+8;
                imgH = icon.children[0].offsetHeight;
                fullscreenImagesG[0].style.height = imgH + "px";
                fullscreenImagesG[1].style.height = imgH + "px";
                icon.style.opacity = 0;
                tempN = 0;
                imgLoopTimer = setInterval(() => {
                    fullscreenImgLoop(i);
                }, 3000);
            }, 2000);
            break;
    }
}

function closeCh(i){
    let index = Math.round(menuScorller.scrollTop/menuScorller.scrollHeight*18);
    const scrollBarBG = document.getElementById("scrollBarBG");
    const backBtn = document.getElementById("backBtn");
    const menuContainer = document.getElementById("menuContainer");
    let ch1, ch2, ch3, ch4, ch5, bg, title, subtitle, icon, closeBtn, slide1, slide2, nextBtn, content, fullscreenBtn, fullscreenImagesContainer;

    bg = document.getElementById("ch"+i+"_bg");
    title = document.getElementById("ch"+i+"_title");
    subtitle = document.getElementById("ch"+i+"_subtitle");
    icon = document.getElementById("ch"+i+"_icon");
    closeBtn = document.getElementById("close"+i);
    closeBtn.style.transitionDuration = "1.5s";
    slide1 = document.getElementById("ch"+i+"_slide_1");
    slide2 = document.getElementById("ch"+i+"_slide_2");
    icon.style.transitionDuration = "0s";
    icon.style.opacity = 1;
    clearInterval(imgLoopTimer);

    if(i<18){
        nextBtn = document.getElementById("ch_next"+i);
        nextBtn.style.transitionDuration = "1s";
    }
    content = document.getElementById("ch_content");
    fullscreenBtn = document.getElementById("ch_fullscreenBtn");
    fullscreenImagesContainer = document.getElementById("fullscreenImagesContainer");
    endingImgLoop(i);

    

    switch (index - i){
        case -1:
            ch1 = document.getElementById("ch"+i);
            ch2 = document.getElementById("ch"+(i+1));
            ch3 = document.getElementById("ch"+(i+2));
            ch4 = document.getElementById("ch"+(i+3));
            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            
            
            
            setTimeout(() => {
                slide1.style.marginTop = "-300px";
                slide1.style.opacity = 0;
                slide1.style.filter = "blur(30px)";
                content.style.opacity = 0;
                content.style.filter = "blur(10px)";
                fullscreenBtn.style.opacity = 0;
                fullscreenBtn.style.filter = "blur(10px)";
                icon.style.transitionDuration = "1.5s";
            }, 500);

            setTimeout(() => {
                slide2.style.marginTop = "260px";
                slide2.style.opacity = 0;
                slide2.style.filter = "blur(30px)";
            }, 700);

            setTimeout(() => {
                nextBtn.style.marginTop = "600px";
                nextBtn.style.opacity = 0;
                nextBtn.style.filter = "blur(30px)";
                nextBtn.onclick = () => {};
            }, 900);

            setTimeout(() => {
                fullscreenImagesContainer.style.display = "none";
            }, 1000);

            setTimeout(() => {
                closeBtn.style.marginLeft = "3400px";
                closeBtn.style.opacity = 0;
                closeBtn.style.filter = "blur(30px)";
                closeBtn.onclick = () => {};
            }, 1100);

            setTimeout(() => {
                ch2.style.transform = "translateY(0px)";
                ch2.style.opacity = 1;
                ch2.style.filter = "blur(0px)";
            }, 1400);

            setTimeout(() => {
                ch3.style.transform = "translateY(0px)";
                ch3.style.opacity = 1;
                ch3.style.filter = "blur(0px)";
            }, 1500);

            setTimeout(() => {
                ch4.style.transform = "translateY(0px)";
                ch4.style.opacity = 1;
                ch4.style.filter = "blur(0px)";
                
                bg.style.width = "300px";
                bg.style.height = "300px";
                bg.style.marginLeft = "";
                bg.style.marginTop = "";
                bg.style.borderRadius = "50px";

                title.style.fontSize = "32px";
                title.style.marginLeft = "";
                title.style.marginTop = "";
                title.style.scale = "1";
                title.style.filter = "blur(0px)";
                title.style.opacity = 1;

                subtitle.style.fontSize = "18px";
                subtitle.style.marginLeft = "";
                subtitle.style.marginTop = "";
                subtitle.style.width = "200px";

                icon.style.width = "200px";
                icon.style.maxHeight = "200px";
                icon.style.borderRadius = "30px";
                icon.style.marginLeft = "";
                icon.style.marginTop = "";

            }, 1600);

            setTimeout(() => {
                ch1.classList.remove("chaptersOpen");
                ch1.classList.add("chapters");
                closeBtn.style.display = "none";
                slide1.style.display = "none";
                slide2.style.display = "none";
                nextBtn.style.display = "none";
                content.style.display = "none";
                fullscreenBtn.style.display = "none";
                if(i+4 <= 18){
                    ch5 = document.getElementById("ch"+(i+4));
                    ch5.style.transform = "translateY(0px)";
                    ch5.style.opacity = 1;
                    ch5.style.filter = "blur(0px)";
                }
                backBtn.style.scale = 1;
                scrollBarBG.style.transform = "translateY(0px)";
                bg.style.transitionDuration = "0.5s";
                title.style.transitionDuration = "0.5s";
                subtitle.style.transitionDuration = "0.5s";
                icon.style.transitionDuration = "0.5s";
                ch1.style.transitionDuration = "0.5s";
                ch2.style.transitionDuration = "0.5s";
                ch3.style.transitionDuration = "0.5s";
                ch4.style.transitionDuration = "0.5s";
                menuScorller.style.pointerEvents = "";
                menuContainer.style.maskMode = "luminance";
            }, 2100);
            setTimeout(() => {
                backBtn.style.transitionDuration = "0.2s";
                isOpen = false;
            }, 3100);
            break;
        case -2:
            ch1 = document.getElementById("ch"+(i-1));
            ch2 = document.getElementById("ch"+i);
            ch3 = document.getElementById("ch"+(i+1));
            ch4 = document.getElementById("ch"+(i+2));
            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            setTimeout(() => {
                slide1.style.marginTop = "-300px";
                slide1.style.opacity = 0;
                slide1.style.filter = "blur(30px)";
                content.style.opacity = 0;
                content.style.filter = "blur(10px)";
                fullscreenBtn.style.opacity = 0;
                fullscreenBtn.style.filter = "blur(10px)";
                icon.style.transitionDuration = "1.5s";
            }, 500);

            setTimeout(() => {
                slide2.style.marginTop = "260px";
                slide2.style.opacity = 0;
                slide2.style.filter = "blur(30px)";
            }, 700);

            setTimeout(() => {
                nextBtn.style.marginTop = "600px";
                nextBtn.style.opacity = 0;
                nextBtn.style.filter = "blur(30px)";
                nextBtn.onclick = () => {};
            }, 900);

            setTimeout(() => {
                fullscreenImagesContainer.style.display = "none";
            }, 1000);

            setTimeout(() => {
                closeBtn.style.marginLeft = "3400px";
                closeBtn.style.opacity = 0;
                closeBtn.style.filter = "blur(30px)";
                closeBtn.onclick = () => {};
            }, 1100);

            setTimeout(() => {
                ch1.style.transform = "translateY(0px)";
                ch1.style.opacity = 1;
                ch1.style.filter = "blur(0px)";
                ch3.style.transform = "translateY(0px)";
                ch3.style.opacity = 1;
                ch3.style.filter = "blur(0px)";
                ch2.style.transform = "";
            }, 1500);
            
            setTimeout(() => {
                ch4.style.transform = "translateY(0px)";
                ch4.style.opacity = 1;
                ch4.style.filter = "blur(0px)";
                
                bg.style.width = "300px";
                bg.style.height = "300px";
                bg.style.marginLeft = "";
                bg.style.marginTop = "";
                bg.style.borderRadius = "50px";

                title.style.fontSize = "32px";
                title.style.marginLeft = "";
                title.style.marginTop = "";
                title.style.scale = "1";
                title.style.filter = "blur(0px)";
                title.style.opacity = 1;

                subtitle.style.fontSize = "18px";
                subtitle.style.marginLeft = "";
                subtitle.style.marginTop = "";
                subtitle.style.width = "200px";

                icon.style.width = "200px";
                icon.style.maxHeight = "200px";
                icon.style.borderRadius = "30px";
                icon.style.marginLeft = "";
                icon.style.marginTop = "";

                
            }, 1600);

            setTimeout(() => {
                ch2.classList.remove("chaptersOpen");
                ch2.classList.add("chapters");
                closeBtn.style.display = "none";
                slide1.style.display = "none";
                slide2.style.display = "none";
                nextBtn.style.display = "none";
                content.style.display = "none";
                fullscreenBtn.style.display = "none";
                if(i+3 <= 18){
                    ch5 = document.getElementById("ch"+(i+3));
                    ch5.style.transform = "translateY(0px)";
                    ch5.style.opacity = 1;
                    ch5.style.filter = "blur(0px)";
                }
                backBtn.style.scale = 1;
                scrollBarBG.style.transform = "translateY(0px)";
                bg.style.transitionDuration = "0.5s";
                title.style.transitionDuration = "0.5s";
                subtitle.style.transitionDuration = "0.5s";
                icon.style.transitionDuration = "0.5s";
                ch1.style.transitionDuration = "0.5s";
                ch2.style.transitionDuration = "0.5s";
                ch3.style.transitionDuration = "0.5s";
                ch4.style.transitionDuration = "0.5s";
                menuScorller.style.pointerEvents = "";
                menuContainer.style.maskMode = "luminance";
            }, 2100);
            setTimeout(() => {
                backBtn.style.transitionDuration = "0.2s";
                isOpen = false;
            }, 3100);
            break;
        case -3:
            ch1 = document.getElementById("ch"+(i-2));
            ch2 = document.getElementById("ch"+(i-1));
            ch3 = document.getElementById("ch"+i);
            ch4 = document.getElementById("ch"+(i+1));
            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            setTimeout(() => {
                slide1.style.marginTop = "-300px";
                slide1.style.opacity = 0;
                slide1.style.filter = "blur(30px)";
                content.style.opacity = 0;
                content.style.filter = "blur(10px)";
                fullscreenBtn.style.opacity = 0;
                fullscreenBtn.style.filter = "blur(10px)";
                icon.style.transitionDuration = "1.5s";
            }, 500);

            setTimeout(() => {
                slide2.style.marginTop = "260px";
                slide2.style.opacity = 0;
                slide2.style.filter = "blur(30px)";
            }, 700);

            setTimeout(() => {
                if(i<18){
                    nextBtn.style.marginTop = "600px";
                    nextBtn.style.opacity = 0;
                    nextBtn.style.filter = "blur(30px)";
                    nextBtn.onclick = () => {};
                }
            }, 900);
            setTimeout(() => {
                fullscreenImagesContainer.style.display = "none";
            }, 1000);

            setTimeout(() => {
                closeBtn.style.marginLeft = "3400px";
                closeBtn.style.opacity = 0;
                closeBtn.style.filter = "blur(30px)";
                closeBtn.onclick = () => {};
            }, 1100);

            setTimeout(() => {
                ch2.style.transform = "translateY(0px)";
                ch2.style.opacity = 1;
                ch2.style.filter = "blur(0px)";
                ch4.style.transform = "translateY(0px)";
                ch4.style.opacity = 1;
                ch4.style.filter = "blur(0px)";
                ch3.style.transform = "";
            }, 1500);
            
            setTimeout(() => {
                ch1.style.transform = "translateY(0px)";
                ch1.style.opacity = 1;
                ch1.style.filter = "blur(0px)";
                
                bg.style.width = "300px";
                bg.style.height = "300px";
                bg.style.marginLeft = "";
                bg.style.marginTop = "";
                bg.style.borderRadius = "50px";

                title.style.fontSize = "32px";
                title.style.marginLeft = "";
                title.style.marginTop = "";
                title.style.scale = "1";
                title.style.filter = "blur(0px)";
                title.style.opacity = 1;

                subtitle.style.fontSize = "18px";
                subtitle.style.marginLeft = "";
                subtitle.style.marginTop = "";
                subtitle.style.width = "200px";

                icon.style.width = "200px";
                icon.style.maxHeight = "200px";
                icon.style.borderRadius = "30px";
                icon.style.marginLeft = "";
                icon.style.marginTop = "";
            }, 1600);

            setTimeout(() => {
                ch3.classList.remove("chaptersOpen");
                ch3.classList.add("chapters");
                closeBtn.style.display = "none";
                slide1.style.display = "none";
                slide2.style.display = "none";
                nextBtn.style.display = "none";
                content.style.display = "none";
                fullscreenBtn.style.display = "none";
                
                if(i+2 <= 18){
                    ch5 = document.getElementById("ch"+(i+2));
                    ch5.style.transform = "translateY(0px)";
                    ch5.style.opacity = 1;
                    ch5.style.filter = "blur(0px)";
                }
                backBtn.style.scale = 1;
                scrollBarBG.style.transform = "translateY(0px)";
                bg.style.transitionDuration = "0.5s";
                title.style.transitionDuration = "0.5s";
                subtitle.style.transitionDuration = "0.5s";
                icon.style.transitionDuration = "0.5s";
                ch1.style.transitionDuration = "0.5s";
                ch2.style.transitionDuration = "0.5s";
                ch3.style.transitionDuration = "0.5s";
                ch4.style.transitionDuration = "0.5s";
                menuScorller.style.pointerEvents = "";
            }, 2100);
            setTimeout(() => {
                backBtn.style.transitionDuration = "0.2s";
                menuContainer.style.maskMode = "luminance";
                isOpen = false;
            }, 3100);
            break;
        case -4:
            ch1 = document.getElementById("ch"+(i-3));
            ch2 = document.getElementById("ch"+(i-2));
            ch3 = document.getElementById("ch"+(i-1));
            ch4 = document.getElementById("ch"+i);
            ch1.style.transitionDuration = "1.5s";
            ch2.style.transitionDuration = "1.5s";
            ch3.style.transitionDuration = "1.5s";
            ch4.style.transitionDuration = "1.5s";
            
            setTimeout(() => {
                slide1.style.marginTop = "-300px";
                slide1.style.opacity = 0;
                slide1.style.filter = "blur(30px)";
                content.style.opacity = 0;
                content.style.filter = "blur(10px)";
                fullscreenBtn.style.opacity = 0;
                fullscreenBtn.style.filter = "blur(10px)";
                icon.style.transitionDuration = "1.5s";
            }, 500);

            setTimeout(() => {
                slide2.style.marginTop = "260px";
                slide2.style.opacity = 0;
                slide2.style.filter = "blur(30px)";
            }, 700);

            setTimeout(() => {
                if(i<18){
                    nextBtn.style.marginTop = "600px";
                    nextBtn.style.opacity = 0;
                    nextBtn.style.filter = "blur(30px)";
                    nextBtn.onclick = () => {};
                }
            }, 900);

            setTimeout(() => {
                fullscreenImagesContainer.style.display = "none";
            }, 1000);

            setTimeout(() => {
                closeBtn.style.marginLeft = "3400px";
                closeBtn.style.opacity = 0;
                closeBtn.style.filter = "blur(30px)";
                closeBtn.onclick = () => {};
            }, 1100);

            setTimeout(() => {
                ch3.style.transform = "translateY(0px)";
                ch3.style.opacity = 1;
                ch3.style.filter = "blur(0px)";
            }, 1400);

            setTimeout(() => {
                ch2.style.transform = "translateY(0px)";
                ch2.style.opacity = 1;
                ch2.style.filter = "blur(0px)";
            }, 1500);

            setTimeout(() => {
                ch1.style.transform = "translateY(0px)";
                ch1.style.opacity = 1;
                ch1.style.filter = "blur(0px)";
                
                bg.style.width = "300px";
                bg.style.height = "300px";
                bg.style.marginLeft = "";
                bg.style.marginTop = "";
                bg.style.borderRadius = "50px";

                title.style.fontSize = "32px";
                title.style.marginLeft = "";
                title.style.marginTop = "";
                title.style.scale = "1";
                title.style.filter = "blur(0px)";
                title.style.opacity = 1;

                subtitle.style.fontSize = "18px";
                subtitle.style.marginLeft = "";
                subtitle.style.marginTop = "";
                subtitle.style.width = "200px";

                icon.style.width = "200px";
                icon.style.maxHeight = "200px";
                icon.style.borderRadius = "30px";
                icon.style.marginLeft = "";
                icon.style.marginTop = "";

                
                ch4.style.transform = "";
            }, 1600);

            setTimeout(() => {
                ch4.classList.remove("chaptersOpen");
                ch4.classList.add("chapters");
                closeBtn.style.display = "none";
                slide1.style.display = "none";
                slide2.style.display = "none";
                content.style.display = "none";
                fullscreenBtn.style.display = "none";
                if(i<18){
                    nextBtn.style.display = "none";
                }
                if(i+1 <= 18){
                    ch5 = document.getElementById("ch"+(i+1));
                    ch5.style.transform = "translateY(0px)";
                    ch5.style.opacity = 1;
                    ch5.style.filter = "blur(0px)";
                }
                backBtn.style.transitionDuration = "1.5s";

                backBtn.style.scale = 1;
                scrollBarBG.style.transform = "translateY(0px)";
                bg.style.transitionDuration = "0.5s";
                title.style.transitionDuration = "0.5s";
                subtitle.style.transitionDuration = "0.5s";
                icon.style.transitionDuration = "0.5s";
                ch1.style.transitionDuration = "0.5s";
                ch2.style.transitionDuration = "0.5s";
                ch3.style.transitionDuration = "0.5s";
                ch4.style.transitionDuration = "0.5s";
                menuScorller.style.pointerEvents = "";
            }, 2100);
            setTimeout(() => {
                menuContainer.style.maskMode = "luminance";
                backBtn.style.transitionDuration = "0.2s";
                isOpen = false;
            }, 3100);
            break;
    }
}

function nextBtnCh(i){
    let index = Math.round(menuScorller.scrollTop/menuScorller.scrollHeight*18);
    const chContainer = document.getElementById("chContainer");

    const scrollBarBG = document.getElementById("scrollBarBG");
    const backBtn = document.getElementById("backBtn");
    const menuContainer = document.getElementById("menuContainer");
    let ch1, ch2, ch3, ch4, bg, title, subtitle, icon, closeBtn, slide1, slide2, nextBtn, content, fullscreenBtn, fullscreenImagesContainer;
    let bg2, title2, subtitle2, icon2, closeBtn2, slide12, slide22, nextBtn2, fullscreenImagesG;

    bg = document.getElementById("ch"+i+"_bg");
    title = document.getElementById("ch"+i+"_title");
    subtitle = document.getElementById("ch"+i+"_subtitle");
    icon = document.getElementById("ch"+i+"_icon");
    closeBtn = document.getElementById("close"+i);
    closeBtn.style.transitionDuration = "1.5s";
    slide1 = document.getElementById("ch"+i+"_slide_1");
    slide2 = document.getElementById("ch"+i+"_slide_2");
    icon.style.transitionDuration = "0s";
    icon.style.opacity = 1;
    clearInterval(imgLoopTimer);

    bg.style.transitionDuration = "1.5s";
    title.style.transitionDuration = "1.5s";
    subtitle.style.transitionDuration = "1.5s";
    icon.style.transitionDuration = "0s";
    closeBtn.style.transitionDuration = "1.5s";
    backBtn.style.transitionDuration = "1.5s";
    

    bg2 = document.getElementById("ch"+(i+1)+"_bg");
    title2 = document.getElementById("ch"+(i+1)+"_title");
    subtitle2 = document.getElementById("ch"+(i+1)+"_subtitle");
    icon2 = document.getElementById("ch"+(i+1)+"_icon");
    closeBtn2 = document.getElementById("close"+(i+1));
    closeBtn2.style.transitionDuration = "1.5s";
    slide12 = document.getElementById("ch"+(i+1)+"_slide_1");
    slide22 = document.getElementById("ch"+(i+1)+"_slide_2");
    icon2.style.transitionDuration = "0s";
    icon2.style.opacity = 1;

    if(i<18){
        nextBtn = document.getElementById("ch_next"+i);
        nextBtn.style.transitionDuration = "1s";
    }
    if(i + 1 < 18){
        nextBtn2 = document.getElementById("ch_next"+(i+1));
        nextBtn2.style.transitionDuration = "1s";
    }
    content = document.getElementById("ch_content");
    fullscreenBtn = document.getElementById("ch_fullscreenBtn");
    fullscreenImagesContainer = document.getElementById("fullscreenImagesContainer");
    endingImgLoop(i);
    content.style.transitionDuration = "1.5s";
    fullscreenBtn.style.transitionDuration = "1.5s";

    ch1 = document.getElementById("ch"+i);
    ch2 = document.getElementById("ch"+(i+1));
    if(index - i == -4){
        ch3 = document.getElementById("ch"+(i-3));
    }
    
    content.style.opacity = 0;
    content.style.filter = "blur(10px)";
    
    setTimeout(() => {
        slide1.style.opacity = 0;
        slide1.style.filter = "blur(30px)";
        slide2.style.opacity = 0;
        slide2.style.filter = "blur(30px)";
        fullscreenBtn.style.opacity = 0;
        fullscreenBtn.style.filter = "blur(10px)";
        icon.style.transitionDuration = "1.5s";
        nextBtn.style.opacity = 0;
        nextBtn.style.filter = "blur(30px)";
        nextBtn.onclick = () => {};
        closeBtn.style.opacity = 0;
        closeBtn.style.filter = "blur(30px)";
        closeBtn.onclick = () => {};
        ch1.style.transitionDuration = "1.5s";
        ch2.style.transitionDuration = "1.5s";
        
    }, 500);

    setTimeout(() => {
        if(index - i == -4){
            chContainer.style.transitionDuration = "1s";
            index++;
            menuScorller.scrollTo(0,((index)/18)*menuScorller.scrollHeight);
        }
        fullscreenImagesContainer.style.display = "none";
        ch2.style.transform = "translateY(0px)";
        ch2.style.opacity = 1;
        ch2.style.filter = "blur(0px)";
        if(i+2 <= 18){
            ch4 = document.getElementById("ch"+(i+2));
            ch4.style.transform = "translateY(1080px)";
            ch4.style.opacity = 0;
            ch4.style.filter = "blur(30px)";
        }
    }, 700);

    setTimeout(() => {
        ch1.style.transform = "translateY(0px)";
        ch1.style.opacity = 1;
        ch1.style.filter = "blur(0px)";
        
        bg.style.width = "300px";
        bg.style.height = "300px";
        bg.style.marginLeft = "";
        bg.style.marginTop = "";
        bg.style.borderRadius = "50px";

        title.style.fontSize = "32px";
        title.style.marginLeft = "";
        title.style.marginTop = "";
        title.style.scale = "1";
        title.style.filter = "blur(0px)";
        title.style.opacity = 1;

        subtitle.style.fontSize = "18px";
        subtitle.style.marginLeft = "";
        subtitle.style.marginTop = "";
        subtitle.style.width = "200px";

        icon.style.width = "200px";
        icon.style.maxHeight = "200px";
        icon.style.borderRadius = "30px";
        icon.style.marginLeft = "";
        icon.style.marginTop = "";

    }, 800);

    setTimeout(() => {
        ch1.classList.remove("chaptersOpen");
        ch1.classList.add("chapters");
        
        tempI = i+1;
        isOpen = true;

        fullscreenImagesG = document.getElementsByClassName("fullscreenImagesG");
        loadContent(content,i+1);

        bg2.style.transitionDuration = "1.5s";
        title2.style.transitionDuration = "1.5s";
        subtitle2.style.transitionDuration = "1.5s";
        icon2.style.transitionDuration = "1.5s";
        closeBtn2.style.transitionDuration = "1.5s";
        backBtn.style.transitionDuration = "1.5s";
        fullscreenImagesG[0].style.transitionDuration = "0s";
        fullscreenImagesG[1].style.transitionDuration = "0s";

        backBtn.style.scale = 0;
        scrollBarBG.style.transform = "translateY(400px)";

        menuScorller.style.pointerEvents = "none";

        ch1.style.transform = "translateY(1080px)";
        ch1.style.opacity = 0;
        ch1.style.filter = "blur(30px)";

        ch2.classList.remove("chapters");
        ch2.classList.add("chaptersOpen");
        ch2.style.transform = `translate(${(index-(i+1)+1)*400}px)`;
        
        bg2.style.width = "2000px";
        bg2.style.height = "2000px";
        bg2.style.marginLeft = "1800px";
        bg2.style.marginTop = "1200px";
        bg2.style.borderRadius = "160px";

        title2.style.fontSize = "100px";
        title2.style.marginLeft = "1600px";
        title2.style.marginTop = "-600px";
        title2.style.scale = "1 0";
        title2.style.filter = "blur(30px)";
        title2.style.opacity = 0;

        subtitle2.style.fontSize = "80px";
        subtitle2.style.marginLeft = "2400px";
        subtitle2.style.marginTop = "-500px";
        subtitle2.style.width = "1000px";

        icon2.style.width = "600px";
        icon2.style.maxHeight = "800px";
        icon2.style.borderRadius = "60px";
        icon2.style.marginLeft = "600px";
        icon2.style.marginTop = "300px";

        


        fullscreenImagesG[0].style.width = icon2.style.width;
        fullscreenImagesG[1].style.width = icon2.style.width;

        closeBtn2.style.display = "block";
        slide12.style.display = "block";
        slide22.style.display = "block";
        if(nextBtn2 != null){
            nextBtn2.style.display = "block";
        }
        content.style.display = "block";
        fullscreenBtn.style.display = "flex";

    }, 900);

    setTimeout(() => {
        slide12.style.marginTop = "-100px";
        slide12.style.opacity = 1;
        slide12.style.filter = "blur(0)";
        closeBtn.style.transitionDuration = "0.2s";
        slide22.style.marginTop = "460px";
        slide22.style.opacity = 0.3;
        slide22.style.filter = "blur(0)";
        icon2.style.transitionDuration = "1.5s";
        if(nextBtn2 != null){
            nextBtn2.style.marginTop = "800px";
            nextBtn2.style.opacity = 1;
            nextBtn2.style.filter = "blur(0)";
            nextBtn2.onclick = () => {nextBtnCh(i+1)};
        }
        closeBtn2.style.marginLeft = "3000px";
        closeBtn2.style.opacity = 1;
        closeBtn2.style.filter = "blur(0)";
        closeBtn2.onclick = () => {closeCh(i+1)};
        fullscreenBtn.style.transitionDuration = "1.5s";
    }, 1000);

    setTimeout(() => {
        if(ch3 != null){
            ch3.style.transform = "translateY(0px)";
            ch3.style.opacity = 1;
            ch3.style.filter = "blur(0px)";
        }
        closeBtn2.style.transitionDuration = "0.2s";
        if(nextBtn2 != null){
            nextBtn2.style.transitionDuration = "0.2s";
        }
        fullscreenBtn.style.opacity = 1;
        fullscreenBtn.style.filter = "blur(0)";
        fullscreenImagesContainer.style.display = "flex";
        fullscreenImagesG[0].children[0].src = `../img/work/${i+1}-1.jpg`;
        fullscreenImagesG[1].children[0].src = `../img/work/${i+1}-1.jpg`;
        fullscreenImagesG[0].style.zIndex = imgNum[i]+7;
        fullscreenImagesG[1].style.zIndex = imgNum[i]+8;
        imgH = icon2.children[0].offsetHeight;
        fullscreenImagesG[0].style.height = imgH + "px";
        fullscreenImagesG[1].style.height = imgH + "px";
        icon2.style.opacity = 0;
        tempN = 0;
        imgLoopTimer = setInterval(() => {
            fullscreenImgLoop(i+1);
        }, 3000);
        chContainer.style.transitionDuration = "0.1s";
        bg.style.transitionDuration = "0.5s";
        title.style.transitionDuration = "0.5s";
        subtitle.style.transitionDuration = "0.5s";
        icon.style.transitionDuration = "0.5s";
        ch1.style.transitionDuration = "0.5s";
        menuScorller.style.pointerEvents = "none";
        content.style.opacity = 1;
        content.style.filter = "blur(0px)";
        ch1.style.transform = "translateY(1080px)";
        closeBtn.style.display = "none";
        slide1.style.display = "none";
        slide2.style.display = "none";
        nextBtn.style.display = "none";
        fullscreenBtn.style.transitionDuration = "0.2s";
    }, 2300);
}


function fullscreenImgLoop(i){
    const imgG = document.getElementsByClassName("fullscreenImagesG");
    
    let Max = imgNum[i-1] - 1;
    imgG[0].children[0].src = `../img/work/${tempI}-${(tempN)%(Max + 1) + 1}.jpg`;
    imgG[1].children[0].src = `../img/work/${tempI}-${(tempN+1)%(Max + 1) + 1}.jpg`;
    imgG[0].children[0].style.animation = "imagesLoop1 1s cubic-bezier(.4,0,.2,1)";
    imgG[1].children[0].style.animation = "imagesLoop2 1s cubic-bezier(.4,0,.2,1)";
    tempN = (tempN+1)%(Max+1);
    setTimeout(() => {
        imgG[0].children[0].style.animation = "none";
        imgG[1].children[0].style.animation = "none";
        imgG[0].children[0].src = `../img/work/${tempI}-${(tempN)%(Max + 1) + 1}.jpg`;
        imgG[1].children[0].src = `../img/work/${tempI}-${(tempN+1)%(Max + 1) + 1}.jpg`;
    }, 1000);
}

function endingImgLoop(i){
    const imgG = document.getElementsByClassName("fullscreenImagesG");
    let Max = imgNum[i-1] - 1;
    if(tempN != 0){
        imgG[0].children[0].src = `../img/work/${tempI}-${(tempN)%(Max + 1) + 1}.jpg`;
        imgG[1].children[0].src =`../img/work/${i}-${1}.jpg`;
        imgG[0].children[0].style.animation = "imagesLoop1 1s cubic-bezier(.4,0,.2,1)";
        imgG[1].children[0].style.animation = "imagesLoop2 1s cubic-bezier(.4,0,.2,1)";
        setTimeout(() => {
            imgG[0].children[0].style.animation = "none";
            imgG[1].children[0].style.animation = "none";
            imgG[0].children[0].src =`../img/work/${i}-${1}.jpg`;
            imgG[1].children[0].src =`../img/work/${i}-${2}.jpg`;
            tempN = 0;
        }, 1000);
    }
}

const fullscrBG = document.getElementById("fullscrBG");
const bgText2 = document.getElementById("bgText2");

function fullscreenCh(){
    clearInterval(imgLoopTimer);
    fullscrBG.style.display = "block";
    const imgContainer = document.getElementById("fullscreenImagesContainer");
    imgContainer.style.margin = "50%";
    const imgG = document.getElementsByClassName("fullscreenImagesG");
    const closeBtn = document.getElementById("fullscrCloseBtn");
    const next = document.getElementById("fullscrNext");
    const prev = document.getElementById("fullscrPrev");
    const fullscrScrollBarBG = document.getElementById("fullscrScrollBarBG");
    const fullscrScrollBarContainer = document.getElementById("fullscrScrollBarContainer");
    const fullscrPageNum = document.getElementById("fullscrPageNum");

    imgG[0].style.transitionDuration = "1s";
    imgG[1].style.transitionDuration = "1s";

    closeBtn.style.display = "block";
    next.style.display = "block";
    prev.style.display = "block";
    fullscrScrollBarBG.style.display = "flex";
    fullscrScrollBarBG.addEventListener("mouseenter", () =>{showPageNum();});
    fullscrScrollBarBG.addEventListener("mouseleave", () =>{hidePageNum();});

    for(let i = 0; i < 2; i++){
        imgG[i].style.height = "1080px";
        imgG[i].style.width = 1080/imgH*600 + "px";
        imgG[i].style.borderRadius = "0";
        imgG[i].style.transform = "translateX(-50%)";
    }

    for(let j = 0; j < imgNum[tempI - 1]; j++){
        const scrollDot = document.createElement("div");
        scrollDot.classList.add("fullscrScrollDot");
        scrollDot.id = `fullscrScrollDot-${j+1}`;
        if( j == tempN){
            scrollDot.classList.add("fullscrScrollDotFocus");

        }
        fullscrScrollBarContainer.appendChild(scrollDot);
    }
    fullscrPageNum.textContent = numberSwitch();
    setTimeout(() => {
        closeBtn.style.opacity = 1;
        closeBtn.style.filter = "blur(0px)";
        next.style.opacity = 1;
        next.style.filter = "blur(0px)";
        prev.style.opacity = 1;
        prev.style.filter = "blur(0px)";
        fullscrScrollBarBG.style.opacity = 1;
        fullscrScrollBarBG.style.filter = "blur(0px)";
        fullscrBG.style.opacity = 1;
        fullscrBG.style.backdropFilter = "blur(30px)";
        chContainer.style.transitionDuration = "2s";
        bgText2.style.transitionDuration = "2s";
        chContainer.style.filter = "blur(30px)";
        bgText2.style.filter = "blur(30px)";
    }, 100);
}

function exitFullscr(){
    const imgContainer = document.getElementById("fullscreenImagesContainer");
    imgContainer.style.margin = "";
    const imgG = document.getElementsByClassName("fullscreenImagesG");
    for(let i = 0; i < 2; i++){
        imgG[i].style.height = imgH + "px";
        imgG[i].style.width = "600px";
        imgG[i].style.borderRadius = "60px";
        imgG[i].style.transform = "translateX(0%)";
    }

    const closeBtn = document.getElementById("fullscrCloseBtn");
    const next = document.getElementById("fullscrNext");
    const prev = document.getElementById("fullscrPrev");
    const fullscrScrollBarBG = document.getElementById("fullscrScrollBarBG");
    const fullscrScrollBarContainer = document.getElementById("fullscrScrollBarContainer");

    fullscrScrollBarContainer.innerHTML = "";

    closeBtn.style.opacity = 0;
    closeBtn.style.filter = "blur(30px)";
    next.style.opacity = 0;
    next.style.filter = "blur(30px)";
    prev.style.opacity = 0;
    prev.style.filter = "blur(30px)";
    fullscrScrollBarBG.style.opacity = 0;
    fullscrScrollBarBG.style.filter = "blur(30px)";
    fullscrScrollBarContainer.style.transform = `translateX(0px)`;

    setTimeout(() => {
        fullscrBG.style.opacity = 0;
        fullscrBG.style.backdropFilter = "blur(0px)";
        chContainer.style.transitionDuration = "2s";
        bgText2.style.transitionDuration = "2s";
        chContainer.style.filter = "blur(0px)";
        bgText2.style.filter = "blur(0px)";
        
        imgLoopTimer = setInterval(() => {
            fullscreenImgLoop(tempI);
        }, 3000);
    }, 100);
    setTimeout(() => {
        closeBtn.style.display = "none";
        next.style.display = "none";
        prev.style.display = "none";
        fullscrScrollBarBG.style.display = "none";
        fullscrBG.style.display = "none";
        chContainer.style.transitionDuration = "";
        bgText2.style.transitionDuration = "";
    }, 2100);
}

function fullscrNextImg(){
    const imgG = document.getElementsByClassName("fullscreenImagesG");
    const scrollDot = document.getElementsByClassName("fullscrScrollDot");
    const fullscrScrollBarContainer = document.getElementById("fullscrScrollBarContainer");
    const fullscrPageNum = document.getElementById("fullscrPageNum");


    let Max = imgNum[tempI-1] - 1;
    if(!isSwitching){
        isSwitching = true;
        imgG[0].children[0].src = `../img/work/${tempI}-${(tempN)%(Max + 1) + 1}.jpg`;
        imgG[1].children[0].src = `../img/work/${tempI}-${(tempN+1)%(Max + 1) + 1}.jpg`;
        imgG[0].children[0].style.animation = "imagesLoop1 1s cubic-bezier(.4,0,.2,1)";
        imgG[1].children[0].style.animation = "imagesLoop2 1s cubic-bezier(.4,0,.2,1)";
        tempN = (tempN+1)%(Max+1);
        for(let i = 0; i < scrollDot.length; i++){
            if(i != tempN)
            scrollDot[i].classList.remove("fullscrScrollDotFocus");
        }
        if(tempN > 2){
            fullscrScrollBarContainer.style.transform = `translateX(-${40*(tempN-2)}px)`;
        }
        else{
            fullscrScrollBarContainer.style.transform = `translateX(0)`;
        }
        scrollDot[tempN].classList.add("fullscrScrollDotFocus");
        fullscrPageNum.textContent = numberSwitch();

        setTimeout(() => {
            imgG[0].children[0].style.animation = "none";
            imgG[1].children[0].style.animation = "none";
            imgG[0].children[0].src = `../img/work/${tempI}-${(tempN)%(Max + 1) + 1}.jpg`;
            imgG[1].children[0].src = `../img/work/${tempI}-${(tempN+1)%(Max + 1) + 1}.jpg`;
            isSwitching = false;
        }, 1000);
    }

}

function fullscrPrevImg(){
    const imgG = document.getElementsByClassName("fullscreenImagesG");
    const scrollDot = document.getElementsByClassName("fullscrScrollDot");
    const fullscrPageNum = document.getElementById("fullscrPageNum");


    let Max = imgNum[tempI-1] - 1;
    if(!isSwitching){
        isSwitching = true;
        imgG[1].children[0].src = `../img/work/${tempI}-${(tempN + (Max + 1))% (Max + 1) + 1}.jpg`;
        imgG[0].children[0].src = `../img/work/${tempI}-${(tempN-1 + (Max + 1))% (Max + 1) + 1}.jpg`;
        imgG[0].children[0].style.animation = "imagesLoop3 1s cubic-bezier(.4,0,.2,1)";
        imgG[1].children[0].style.animation = "imagesLoop4 1s cubic-bezier(.4,0,.2,1)";
        tempN = (tempN-1 + (Max+1))%(Max+1);
        for(let i = 0; i < scrollDot.length; i++){
            if(i != tempN)
            scrollDot[i].classList.remove("fullscrScrollDotFocus");
        }
        if(tempN > 2){
            fullscrScrollBarContainer.style.transform = `translateX(-${40*(tempN-2)}px)`;
        }
        else{
            fullscrScrollBarContainer.style.transform = `translateX(0)`;
        }
        scrollDot[tempN].classList.add("fullscrScrollDotFocus");
        fullscrPageNum.textContent = numberSwitch();

        setTimeout(() => {
            imgG[0].children[0].style.animation = "none";
            imgG[1].children[0].style.animation = "none";
            isSwitching = false;
        }, 1000);
    }
}

function numberSwitch(){
    let newString = "";
    let Max = imgNum[tempI-1];
    let MaxString;
    if(Max < 10){
        MaxString = `0${Max}`;
    }
    else{
        MaxString = `${Max}`;
    }
    if(tempN + 1 < 10){
        newString = `0${tempN+1} / ${MaxString}`;
    }
    else{
        newString = `${tempN+1} / ${MaxString}`;
    }
    return newString;
}

function showPageNum(){
    const fullscrScrollBarContainer = document.getElementById("fullscrScrollBarContainer");
    const fullscrPageNum = document.getElementById("fullscrPageNum");

    fullscrScrollBarContainer.style.opacity = 0;
    fullscrScrollBarContainer.style.filter = "blur(15px)";
    fullscrPageNum.style.opacity = 1;
    fullscrPageNum.style.filter = "blur(0px)";
}

function hidePageNum(){
    const fullscrScrollBarContainer = document.getElementById("fullscrScrollBarContainer");
    const fullscrPageNum = document.getElementById("fullscrPageNum");

    fullscrScrollBarContainer.style.opacity = 1;
    fullscrScrollBarContainer.style.filter = "blur(0px)";
    fullscrPageNum.style.opacity = 0;
    fullscrPageNum.style.filter = "blur(15px)";
}