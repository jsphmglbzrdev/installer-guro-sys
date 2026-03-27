import React from 'react'
import { AlertCircle } from 'lucide-react'

const ConfirmationModal = ({ isOpen, headingText, buttonTxt, message, onConfirm, onCancel }) => {
	if (!isOpen) return null;

	return (
		<div onClick={onCancel} className='fixed bg-black/40 inset-0 flex items-center backdrop-blur-sm justify-center z-50 p-4'>
			<div onClick={(e) => e.stopPropagation()} className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100'>
				<div className='flex items-center space-x-3 mb-4'>
					<div className='bg-red-50 p-2.5 rounded-lg'>
						<AlertCircle className='h-6 w-6 text-red-600' />
					</div>
					<h3 className='text-xl font-semibold text-slate-900'>{headingText || 'Confirm Action'}</h3>
				</div>
				
				<p className='text-slate-600 text-sm mb-6 leading-relaxed'>
					{message || 'Are you sure you want to proceed? This action cannot be undone.'}
				</p>
				
				<div className='mt-6 flex gap-3 flex-row justify-end'>
					<button 
						onClick={onCancel}
						className='py-2.5 px-5 cursor-pointer bg-white border-2 border-slate-300 rounded-xl text-slate-700 font-medium transition-all hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300'
					>
						Cancel
					</button>
					<button 
						onClick={onConfirm}
						className='py-2.5 px-5 cursor-pointer bg-red-600 text-white rounded-xl font-medium transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
					>
						{buttonTxt || 'Confirm'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmationModal	