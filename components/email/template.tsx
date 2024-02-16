import * as React from 'react'

interface EmailTemplateProps {
    name: string;
    email: string;
    content: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name,
    email,
    content
}) => (
    <div>
        <table>
            <tr>
                <td><span><h5>Name:</h5>{name}</span></td>
                <td><span><h5>eMail:</h5>{email}</span></td>
            </tr>
            <tr>
                <td>
                    <h5>Content:</h5>
                    <pre>{content}</pre>
                </td>
            </tr>
        </table>
    </div>
)