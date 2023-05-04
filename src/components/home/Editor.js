import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
const Editor = (props) => {
	const editor = useRef(null);
	// const [content, setContent] = useState('');
	const config = {
		placeholder: "Announce something to your class",
		minHeight: 250,
		textIcons: false,
		showCharsCounter: false,
		showWordsCounter: false,
		showXPathInStatusbar: false,
		buttons: ["bold", "underline", "italic"],
		readonly: false,
		toolbarAdaptive: false,
	};
	return useMemo(
		() => (
			<JoditEditor
				ref={editor}
				value={props.contents}
				config={config}
				onBlur={(event) => props.getValue(event)}
			/>
		),
		[]
	);
};

export default Editor;
