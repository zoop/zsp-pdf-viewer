import * as React from 'react';
import { PrimaryButton, MinimalButton, Modal } from '@react-pdf-viewer/core';
import type { Store } from '@react-pdf-viewer/core';

import StoreProps from './StoreProps';

const ConfirmationModal: React.FC<{
    store: Store<StoreProps>;
}> = ({ store }) => {
    const [target, setTarget] = React.useState('');

    const handleTargetClicked = (clickedTarget: string) => {
        setTarget(clickedTarget);
    };

    const handleCancel = () => {
        setTarget('');
    };

    const handleConfirm = () => {
        setTarget('');
        window.open(target, '_blank');
    };

    const renderContent = () => (
        // <div style={{ padding: '0.5rem' }}>
        //     <div
        //         style={{
        //             borderBottom: '1px solid rgba(0, 0, 0, .1)',
        //             paddingBottom: '0.5rem',
        //             marginBottom: '0.5rem',
        //         }}
        //     >
        //         <p>Are you sure that you want to follow this link</p>
        //         <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{target}</p>?
        //     </div>
        //     <div
        //         style={{
        //             alignItems: 'center',
        //             display: 'flex',
        //             justifyContent: 'end',
        //         }}
        //     >
        //         <div style={{ marginRight: '0.25rem' }}>
        //             <MinimalButton onClick={handleCancel}>No</MinimalButton>
        //         </div>
        //         <PrimaryButton onClick={handleConfirm}>Yes</PrimaryButton>
        //     </div>
        // </div>

        <div className='p-4'>
            <div className='border-b border-black/10 pb-4 mb-4'>
                <h5 className='text-lg font-semibold text-gray-800'>Are you sure that you want to follow this link</h5>
                <h5 className='text-lg font-bold underline text-gray-700'>{target}</h5>
            </div>
            <div className='flex items-center justify-end space-x-2'> 
                <div className='mr-1'>
                    <MinimalButton onClick={handleCancel}>No</MinimalButton>
                </div>
                    <PrimaryButton onClick={handleConfirm}>Yes</PrimaryButton>
            </div>
        </div>
    );

    React.useEffect(() => {
        store.subscribe('clickedTarget', handleTargetClicked);

        return () => {
            store.unsubscribe('clickedTarget', handleTargetClicked);
        };
    }, []);

    return (
        target && <Modal isOpened={true} closeOnClickOutside={false} closeOnEscape={false} content={renderContent} />
    );
};

export default ConfirmationModal;