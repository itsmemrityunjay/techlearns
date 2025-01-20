import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useInView } from 'react-intersection-observer';

const CommunitySection = () => {
  const [activeTab, setActiveTab] = useState('C++');
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { ref: headingRef, inView } = useInView({ triggerOnce: false });

  const codeSamples = {
    'C++': `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *   int val;
 *   ListNode *next;
 *   ListNode(int x) : val(x), next(NULL) {}
 * };
 */
void trimLeftTrailingSpaces(string &input) {
    input.erase(input.begin(), find_if(input.begin(), input.end(), [](int ch) {
        return !isspace(ch);
    }));
}
void trimRightTrailingSpaces(string &input) {
    input.erase(find_if(input.rbegin(), input.rend(), [](int ch) {
        return !isspace(ch);
    }).base(), input.end());
}`,
    'Java': `// Java code for Linked List
class Node {
    int data;
    Node next;

    Node(int d) {
        data = d;
        next = null;
    }
}

class LinkedList {
    Node head;
}`,
    'Python': `# Python code for Linked List
class Node:
    def _init_(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def _init_(self):
        self.head = None`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSamples[activeTab]);
    alert('Code copied to clipboard!');
  };

  const typewriterEffect = (code, reverse = false) => {
    let index = reverse ? code.length : 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      setDisplayedCode((prev) => code.slice(0, reverse ? --index : ++index));
      if (index === (reverse ? code.length : 0)) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20); // Faster typing for smooth effect

    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (!isTyping) {
      if (inView) {
        typewriterEffect(codeSamples[activeTab]);
      } else {
        typewriterEffect(codeSamples[activeTab], true);
      }
    }
  }, [inView, activeTab]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="text-center mt-12" ref={headingRef}>
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-teal-600 text-3xl">{`</>`}</span>
          </div>
        </div>
        <h1 className="text-3xl font-semibold mt-4">Developer Playground</h1>
        <p className="text-gray-600 mt-2">
          Test, debug, and learn with our developer tools. Easily switch between supported coding languages.
        </p>
      </div>

      {/* Code Editor Section */}
      <div className="flex-1 bg-white shadow-lg rounded-lg mx-auto mt-8 w-3/4">
        {/* Tabs */}
        <div className="flex border-b">
          {['C++', 'Java', 'Python'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 w-1/3 text-center font-medium ${
                activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div className="p-4 overflow-auto">
          <SyntaxHighlighter
            language={activeTab.toLowerCase()}
            style={tomorrow}
            showLineNumbers
          >
            {displayedCode || '// Select a tab to display the code'}
          </SyntaxHighlighter>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end p-4 border-t">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md mr-2"
            onClick={handleCopy}
          >
            Copy
          </button>
          <button className="bg-yellow-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md">
            Run
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md ml-2">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
