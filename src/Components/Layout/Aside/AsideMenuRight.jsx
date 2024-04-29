import React from 'react'
import CardSmall from '../../CardSmall/_CardSmall'

const AsideContent = () => {
    return (
        <div className='h-full bg-white w-full block p-2 px-4 border border-x-2 border-t-0'>
            <h3 className="text-start my-2">Information</h3>
            <div className="grid grid-cols-1 gap-5">
                <CardSmall
                    _one="Active"
                    _two="test"
                    _three="Details"
                    icon="FcAbout"
                    className="bg-blue-200"

                />
                <CardSmall
                    _one="In Asteptare"
                    _two="test"
                    _three="Nume Client"
                    icon="hightPriority"
                    className="bg-yellow-200"
                />
                <CardSmall
                    _one="Finalizate"
                    _two="test"
                    _three="Nr.Doc"
                    icon="FcOk"
                    className="bg-green-200"
                />
                <CardSmall
                    _one="Nerezolvate"
                    _two="test"
                    _three="Details"
                    icon="FcBearish"
                    className="bg-red-200"
                />

            </div>
        </div>
    )
}

export default AsideContent
