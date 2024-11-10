import React from 'react';

const TutorialPage: React.FC = () => {
  return (
    <div className="tutorial-page p-4">
      <h1>Tutorials</h1>
      <p>Learn how to use the application effectively with our step-by-step tutorials.</p>
      {/* Add tutorial content or embedded videos */}
      <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/example_video"
        title="Tutorial Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default TutorialPage;
