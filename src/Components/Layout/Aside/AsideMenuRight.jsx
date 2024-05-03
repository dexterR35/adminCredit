import React from 'react'
import CardSmall from '../../CardSmall/_CardSmall'

const AsideContent = () => {
    return (
        <div className='h-full w-full block p-2 px-4 border border-t-0'>
            <h3 className="text-start my-6">Information</h3>
            <div className="grid grid-cols-1 gap-5">
                <CardSmall
                    _one="Active"
                    _two="4"
                    _three="Details"
                    icon="FcAbout"
                    className='bg-green-200'
                />
                <CardSmall
                    _one="In Asteptare"
                    _two="3"
                    _three="Nume Client"
                    icon="hightPriority"
                    className="bg-yellow-200"
                />
                <CardSmall
                    _one="Nerezolvate"
                    _two="6"
                    _three="Details"
                    icon="FcBearish"
                    className="bg-red-200"
                />
                <CardSmall
                    _one="Finalizate"
                    _two="5"
                    _three="Nr.Doc"
                    icon="FcOk"
                    className="bg-indigo-200"
                />
                <h3 className="text-start my-2">Intern</h3>
                <CardSmall
                    _one="Consultanti"
                    _two="3"
                    _three="Florin Hodor"
                    icon="FcOk"
                    className="bg-low-color"
                />
            </div>
        </div>
    )
}

export default AsideContent
