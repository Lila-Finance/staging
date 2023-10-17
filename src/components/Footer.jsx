import React from 'react';

const Footer = () => {
  return (
    <div className="bg-white text-black pt-20 pb-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Lila Finance</h1>
            <p className="mt-2">Fixed Income Solutions</p>
            <p className="mt-2 text-sm">© 2023 Lila Finance</p>
          </div>
          <div className="space-y-4">
            <div className="font-bold text-xl">Product</div>
            <ul>
              <li>Docs</li>
              <li>Discord</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="font-bold text-xl">Resources</div>
            <ul>
              <li>Terms of service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="font-bold text-xl">Social</div>
            <ul>
              <li>LinkedIn</li>
              <li>X [Twitter]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
