import React from 'react';

const DocumentationSee = ({ anchor }) => {
    return (
        <div>
            <a href={`#/${anchor}`}>See documentation for {anchor}</a>
        </div>
    );
};

export default DocumentationSee;
