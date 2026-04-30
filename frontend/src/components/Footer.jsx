import React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme';
import { Container } from '@mui/material';
function Footer() {
  return (
    <ThemeProvider theme={theme}>
      <div className="bg-primary mt-12 pt-12 pb-6 px-8">
        <Container className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* About Us */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">About Us</h3>
              <p className="text-gray-300 text-sm">We Matter is a mental health platform that provides support and resources to help you on your mental health journey.</p>
            </div>
            
            {/* Popular Categories */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Popular Categories</h3>
              <ul className="space-y-2">
                {['Therapy Sessions', 'Self-Assessment Questionnaire', 'Mood Tracking', 'Journaling'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Policy */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Policy</h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms & Conditions', 'Data Protection & Confidentiality', 'Crisis & Safety Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Us */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Contact Us</h3>
              <p className="text-gray-300 text-sm mb-4">Have questions or need support? Reach out to us through our social media channels.</p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram'].map((platform) => (
                  <a key={platform} href="#" className="text-white hover:text-primaryHover transition-colors">
                    <i className={`fa-brands fa-${platform} text-xl`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Border and copyright section */}
          <div className="flex flex-col items-center pt-6">
            <p className="text-gray-400 text-sm text-center">
              © 2026 We Matter. All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default Footer