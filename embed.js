document.addEventListener("DOMContentLoaded", function () {
  // Create the chat icon container
  const chatIcon = document.createElement("div");
  chatIcon.className = "chat";
  chatIcon.id = "chatIcon";
  chatIcon.setAttribute("aria-label", "Open Chatbot");
  chatIcon.setAttribute("role", "button");
  chatIcon.setAttribute("tabindex", "0");

   
  const background = document.createElement("div");
  background.className = "background";
  chatIcon.appendChild(background);

  
  const openSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  openSvg.setAttribute("width", "44px");
  openSvg.setAttribute("height", "34px");
  openSvg.setAttribute("viewBox", "0 0 24 24");
  openSvg.setAttribute("fill", "none");
  openSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  openSvg.setAttribute("stroke", "#ffffff");
  openSvg.innerHTML = `
      <path d="M8 10H16M8 14H16M21.0039 12C21.0039 16.9706 16.9745 21 12.0039 21C9.9675 21 3.00463 21 3.00463 21C3.00463 21 4.56382 17.2561 3.93982 16.0008C3.34076 14.7956 3.00391 13.4372 3.00391 12C3.00391 7.02944 7.03334 3 12.0039 3C16.9745 3 21.0039 7.02944 21.0039 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    `;
  background.appendChild(openSvg);
 
  const closeSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  closeSvg.setAttribute("fill", "#ffffff");  
  closeSvg.setAttribute("width", "40px");
  closeSvg.setAttribute("height", "30px");
  closeSvg.setAttribute("viewBox", "0 0 200 200");
  closeSvg.setAttribute("data-name", "Layer 1");
  closeSvg.setAttribute("id", "Layer_1");
  closeSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  closeSvg.innerHTML = `
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z"></path>
      </g>
    `;
  closeSvg.style.display = "none"; 
  background.appendChild(closeSvg);
 
  const iframe = document.createElement("iframe");
  iframe.src = "https://chatbot-user.vercel.app";
  iframe.style.position = "fixed";
  iframe.style.bottom = "100px";
  iframe.style.right = "20px";
  iframe.style.width = "350px";
  iframe.style.height = "500px";
  iframe.style.border = "none";
  iframe.style.zIndex = "9999";
  iframe.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  iframe.style.display = "none";  
  iframe.style.backgroundColor = "white"; 
  iframe.style.overflow = "hidden";  
  iframe.setAttribute("scrolling", "no"); 
  document.body.appendChild(iframe);

  
  document.body.appendChild(chatIcon);
 
  const toggleChat = () => {
    const isActive = chatIcon.classList.toggle("active");
    iframe.style.display = isActive ? "block" : "none";
    chatIcon.setAttribute(
      "aria-label",
      isActive ? "Close Chatbot" : "Open Chatbot"
    );

    // Toggle SVG visibility inside the blue bubble
    openSvg.style.display = isActive ? "none" : "block"; // Hide open icon when opened
    closeSvg.style.display = isActive ? "block" : "none"; // Show close icon when opened
  };

  // Add event listeners for click and keyboard interaction
  chatIcon.addEventListener("click", toggleChat);
  chatIcon.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") toggleChat();
  });

  // Add styles dynamically
  const style = document.createElement("style");
  style.textContent = `
          .chat {
            display: flex;
            position: fixed;
            bottom: 20px;
            right: 20px;
            cursor: pointer;
            z-index: 10000;
          }
          .background {
            background-color: #1950ff;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            height: 64px;
            width: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .chat-bubble {
            position: relative;
            width: 64px;
            height: 64px;
          }
          .chat:hover .background {
            background-color: #003cff;
          }
        `;
  document.head.appendChild(style);
});
