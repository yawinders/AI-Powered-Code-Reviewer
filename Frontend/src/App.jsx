import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [loader, setLoader] = useState(false);
  const [outputLoader, setOutputLoader] = useState(false)
  const [language_id, setLanguage_id] = useState(63)
  const [output, setOutput] = useState("")
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    setLoader(true)
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
    setLoader(false);
  }
  async function getOutput(e) {
    e.stopPropagation()
    setOutputLoader(true)
    const response = await axios.post('http://localhost:3000/ai/get-output', { code, language_id })
    console.log(response.data.output);
    setOutput(response.data.output)
    setOutputLoader(false)
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>
          {loader ? <div className='spinner review'></div> : <div
            // isLoading={loader}
            onClick={reviewCode}
            className="review">Review
            {outputLoader ? <div className='spinner review'></div> : <span

              // isLoading={loader}
              onClick={(e) => getOutput(e)}
              className="revieww">Output</span>}
          </div>}


        </div>
        <div className="right">
          <Markdown

            rehypePlugins={[rehypeHighlight]}

          >{review}</Markdown>
        </div>
      </main>
    </>
  )
}



export default App
