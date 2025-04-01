import React from "react";

const QuickCompiler = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-14 bg-black min-h-screen p-10">
      <p className="text-4xl font-semibold text-white max-w-4xl text-center">
        Explore Innovation FruitboxFlex and Quick Compiler
      </p>

      <div className="relative w-full lg:max-w-screen-lg bg-gray-800 p-8 rounded-3xl shadow-lg">
        <div className="w-full flex items-center justify-center perspective-1000">
          <div className="flex items-center justify-center relative border-2 border-transparent transition-all duration-200 ease-linear overflow-hidden shadow-inner inter-var w-full rounded-3xl preserve-3d">
            <div className="preserve-3d relative px-3 pt-14 sm:px-24 sm:pt-24 lg:pr-0 w-full">
              <div className="w-full flex gap-12 sm:gap-24 lg:flex-row flex-col justify-center items-start">
                <div className="w-full flex flex-col items-start gap-14 flex-1">
                  <div className="flex flex-col gap-y-3 self-stretch items-start">
                    <div className="flex flex-col items-start self-stretch gap-y-2">
                      <p className="text-orange-500 font-semibold text-lg">Quick Compiler</p>
                      <p className="text-white font-semibold text-4xl">Code On-the-Go with Quick Compiler</p>
                    </div>
                    <p className="text-base text-gray-400 font-medium">
                      Whether you're fine-tuning your code or exploring new languages, Quick Compiler simplifies the coding process, making it faster and more accessible for every developer.
                    </p>
                  </div>
                  <button className="btn-primary bg-orange-500 text-white py-2 px-6 rounded-lg">Try it Yourself</button>
                </div>
                <div className="code-container relative h-[250px] sm:h-[450px] lg:w-[600px] bg-gray-900 p-4 rounded-lg">
                  <div className="absolute left-0 top-0 p-4 text-green-500">
                    {[...Array(12)].map((_, index) => (
                      <p key={index}>{index + 1}</p>
                    ))}
                  </div>
                  <div className="code-content pl-12 text-green-500">
                    <pre>{`<!DOCTYPE html>
<html>
<head>
<title>Example</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1><a href="/">Header</a></h1>
<nav>
  <a href="one/">One</a>
  <a href="two/">Two</a>
  <a href="three/">Three</a>
</nav>
</body>
</html>`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="badge absolute top-0 right-0 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="w-9 h-9 fill-orange-500">
            <path d="M19.474 5.075l11.783 6.804a2.95 2.95 0 011.474 2.551v7.14a2.95 2.95 0 01-1.474 2.551l-11.783 6.803a2.95 2.95 0 01-2.947 0L4.743 24.121a2.95 2.95 0 01-1.473-2.552V14.43c0-1.052.561-2.025 1.473-2.551l11.784-6.804a2.95 2.95 0 012.947 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default QuickCompiler;
