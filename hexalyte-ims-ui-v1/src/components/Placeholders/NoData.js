import React from 'react'
import { FileText } from 'lucide-react'

function NoData() {
    return (
        <div className="flex flex-col items-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No orders found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
        </div>
    )
}

export default NoData