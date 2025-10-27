import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
})

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false
    }
}

const formats = [
    'header',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'align',
    'color',
    'background',
    'link',
    'image',
    'video'
]

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    height?: string;
}

export default function QuillEditor({
    value,
    onChange,
    placeholder = "Enter content...",
    className = "",
    height = "400px"
}: QuillEditorProps) {
    useEffect(() => {
        // Add theme-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .dark .ql-toolbar.ql-snow {
                border-color: var(--color-border) !important;
                background: var(--color-card) !important;
            }
            .dark .ql-container.ql-snow {
                border-color: var(--color-border) !important;
                background: var(--color-card) !important;
                color: var(--color-foreground) !important;
            }
            .dark .ql-toolbar.ql-snow .ql-picker-label {
                color: var(--color-foreground) !important;
            }
            .dark .ql-toolbar.ql-snow .ql-stroke {
                stroke: var(--color-foreground) !important;
            }
            .dark .ql-toolbar.ql-snow .ql-fill {
                fill: var(--color-foreground) !important;
            }
            .dark .ql-editor.ql-blank::before {
                color: var(--color-muted-foreground) !important;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className={`min-h-[200px] border rounded-lg overflow-hidden ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ height }}
            />
        </div>
    )
} 