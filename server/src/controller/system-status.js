import {ImportLog} from '../models/importLogSchema.js'
export const lastImportStatus = async (req, res) => {
    try{
        const lastImport = await ImportLog.findOne().sort({ timestamp: -1 });
        res.json(lastImport);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve last import status' });
    }
}