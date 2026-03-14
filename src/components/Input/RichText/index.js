import React, { useEffect, useRef } from 'react';
import { createEditor, createToolbar } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import { componentVersions } from '../../../utils/version-config';
import classNames from 'classnames';
import './index.less';

const RichText = ({ version, className, value, onChange, placeholder, ...props }) => {
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const toolbarContainerRef = useRef(null);

  const richTextClassName = classNames(
    'tt-rich-text',
    className
  );

  useEffect(() => {
    if (!editorContainerRef.current) return;

    const editor = createEditor({
      selector: editorContainerRef.current,
      html: value || '',
      placeholder: placeholder || '请输入内容...',
      onChange: (editor) => {
        if (onChange) {
          onChange(editor.getHtml());
        }
      },
      ...props
    });

    editorRef.current = editor;

    if (toolbarContainerRef.current) {
      createToolbar({
        editor,
        selector: toolbarContainerRef.current
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentHtml = editorRef.current.getHtml();
      if (currentHtml !== value) {
        editorRef.current.setHtml(value);
      }
    }
  }, [value]);

  return (
    <div
      className={richTextClassName}
      data-component-version={version}
    >
      <div ref={toolbarContainerRef} className="tt-rich-text-toolbar" />
      <div ref={editorContainerRef} className="tt-rich-text-editor" />
    </div>
  );
};

RichText.version = componentVersions.Input;

export default RichText;
