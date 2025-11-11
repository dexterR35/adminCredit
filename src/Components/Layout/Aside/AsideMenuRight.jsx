import React from 'react'
import CardSmall from '../../CardSmall/_CardSmall'

const AsideContent = () => {
    return (
        <div className='h-full w-full p-4 overflow-y-auto'>
            {/* Information Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white">Information</h3>
                </div>
                <div className="space-y-4">
                    <CardSmall
                        _one="Active"
                        _two="4"
                        _three="Details"
                        icon="FcAbout"
                        className='bg-gradient-to-br from-emerald-900/50 via-green-900/50 to-teal-900/50 border border-emerald-700'
                    />
                    <CardSmall
                        _one="In Asteptare"
                        _two="3"
                        _three="Nume Client"
                        icon="hightPriority"
                        className="bg-gradient-to-br from-amber-900/50 via-yellow-900/50 to-orange-900/50 border border-amber-700"
                    />
                    <CardSmall
                        _one="Nerezolvate"
                        _two="6"
                        _three="Details"
                        icon="FcBearish"
                        className="bg-gradient-to-br from-red-900/50 via-rose-900/50 to-pink-900/50 border border-red-700"
                    />
                    <CardSmall
                        _one="Finalizate"
                        _two="5"
                        _three="Nr.Doc"
                        icon="FcOk"
                        className="bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-violet-900/50 border border-indigo-700"
                    />
                </div>
            </div>

            {/* Internal Section */}
            <div className="pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white">Internal</h3>
                </div>
                <CardSmall
                    _one="Consultanti"
                    _two="3"
                    _three="Florin Hodor"
                    icon="FcOk"
                    className="bg-gradient-to-br from-blue-900/50 via-indigo-900/50 to-purple-900/50 border border-blue-700"
                />
            </div>
        </div>
    )
}

export default AsideContent
