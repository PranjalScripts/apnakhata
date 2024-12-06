import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="max-w-screen-lg mx-auto">
        <p className="text-center">
          THIS IS MY FOOTER
        </p>
        
      
         
      </div>
    </footer>
  );
};

const FooterDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">{/* Your content here */}</div>
      <Footer />
    </div>
  );
};

export default FooterDashboard;
