'use strict'
// referred from markdown-preview-view.coffee in the official Markdown Preview
function getTextEditorStyles() {
  let textEditorStyles = document.createElement("atom-styles")
  textEditorStyles.initialize(atom.styles)
  textEditorStyles.setAttribute("context", "atom-text-editor")
  document.body.appendChild(textEditorStyles)

  // Extract style elements content
  let style = Array.prototype.slice.apply(textEditorStyles.childNodes).map((styleElement) => styleElement.innerText)

  // delete element
  textEditorStyles.parentNode.removeChild(textEditorStyles)

  return style
}

// get array of styles that has 'atom-text-editor' or ':host'
function getReplacedTextEditorStyles() {
  let styles = getTextEditorStyles(),
      output = []
  for (let i = 0; i < styles.length; i++) {
    if (styles[i].indexOf('atom-text-editor') >= 0) {
      output.push(styles[i]
                    .replace(/atom-text-editor/g, '.markdown-preview-enhanced pre')
                    .replace(/:host/g, '.markdown-preview-enhanced .host'))
    }
  }
  return output.join('\n')
}


function getMarkdownPreviewCSS() {
  let markdownPreviewRules = [],
      ruleRegExp = /\.markdown-preview-enhanced/,
      cssUrlRefExp = /url\(atom:\/\/markdown-preview-enhanced\/assets\/(.*)\)/

  for (let i = 0; i < document.styleSheets.length; i++) {
    let stylesheet = document.styleSheets[i]
    if (stylesheet.rules.length) {
      for (let j = 0; j < stylesheet.rules.length; j++) {
        let rule = stylesheet.rules[j]

        // We only need `.markdown-preview-enhanced` css
        if (rule.cssText.match(ruleRegExp)) {
          markdownPreviewRules.push(rule.cssText)
        }
      }
    }
  }

  return markdownPreviewRules
          .concat(getTextEditorStyles())
          .join('\n')
          .replace(/atom-text-editor/g, 'pre.editor-colors')
          .replace(/:host/g, '.host') // Remove shadow-dom :host selector causing problem on FF
}

module.exports = {
  getTextEditorStyles,
  getMarkdownPreviewCSS,
  getReplacedTextEditorStyles
}
