const { RecordOperations, GetRecordParam, DeleteRecordParam } = require('@zohocrm/nodejs-sdk-2.0/core/com/zoho/crm/api/record/record_operations');
const { BodyWrapper } = require('@zohocrm/nodejs-sdk-2.0/core/com/zoho/crm/api/record/body_wrapper');
const { ActionWrapper } = require('@zohocrm/nodejs-sdk-2.0/core/com/zoho/crm/api/record/action_wrapper');
const { SuccessResponse } = require('@zohocrm/nodejs-sdk-2.0/core/com/zoho/crm/api/record/success_response');
const { APIException } = require('@zohocrm/nodejs-sdk-2.0/core/com/zoho/crm/api/record/api_exception');
const ZCRMRecord = require('@zohocrm/nodejs-sdk-2.0/core/com/zoho/crm/api/record/record').Record;
const { ParameterMap } = require('@zohocrm/nodejs-sdk-2.0/routes/parameter_map');
const { Choice } = require('@zohocrm/nodejs-sdk-2.0/utils/util/choice');

const MODULE_NAME = 'Leads';

const fieldMapping = {
  First_Name: 'First_Name',
  Last_Name: 'Last_Name',
  Phone: 'Phone',
  Email: 'Email',
  Car: 'Car',
  Created_By: 'Created_By',
  Connected_To__s: 'Connected_To__s',
  Owner: 'Owner',
  Lead_Status: 'Lead_Status',
  Lead_Source: 'Lead_Source',
  Modified_By: 'Modified_By',
  Location: 'Location',
  Nationality: 'Nationality',
  leadchain0__Social_Lead_ID: 'leadchain0__Social_Lead_ID'
};

function validateRequiredFields(data) {
  const required = ['Last_Name', 'Phone', 'Lead_Status', 'Location'];
  const missing = required.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

function buildRecord(data) {
  const record = new ZCRMRecord();
  const picklistFields = ['Lead_Status', 'Location', 'Nationality', 'Lead_Source'];
  
  Object.keys(data).forEach(key => {
    if (fieldMapping[key]) {
      const value = picklistFields.includes(key) ? new Choice(data[key]) : data[key];
      record.addKeyValue(key, value);
    }
  });
  return record;
}

async function createLead(req, res) {
  try {
    validateRequiredFields(req.body);
    
    const record = buildRecord(req.body);
    const request = new BodyWrapper();
    request.setData([record]);

    const recordOperations = new RecordOperations();
    const response = await recordOperations.createRecords(MODULE_NAME, request);

    if (response) {
      const responseObject = response.getObject();
      
      if (responseObject instanceof ActionWrapper) {
        const records = responseObject.getData();
        
        if (records && records.length > 0) {
          const record = records[0];
          
          if (record instanceof SuccessResponse) {
            const details = record.getDetails();
            return res.json({
              success: true,
              id: details ? details.get('id') : null,
              message: record.getMessage() ? record.getMessage().getValue() : 'Lead created'
            });
          } else if (record instanceof APIException) {
            console.log('API Exception Details:', record.getDetails());
            return res.status(400).json({
              success: false,
              error: record.getMessage() ? record.getMessage().getValue() : 'API Error',
              code: record.getCode() ? record.getCode().getValue() : null,
              details: record.getDetails()
            });
          }
        }
      }
    }
    res.status(500).json({ success: false, error: 'No response from Zoho' });
  } catch (error) {
    console.error('Create Lead Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function updateLead(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Lead ID is required' });
    }

    const record = buildRecord(req.body);
    record.setId(id);
    
    const request = new BodyWrapper();
    request.setData([record]);

    const recordOperations = new RecordOperations();
    const response = await recordOperations.updateRecords(MODULE_NAME, request);

    if (response) {
      const responseObject = response.getObject();
      if (responseObject instanceof ActionWrapper) {
        const records = responseObject.getData();
        if (records && records.length > 0) {
          const record = records[0];
          if (record instanceof SuccessResponse) {
            return res.json({
              success: true,
              id: record.getDetails().get('id'),
              message: record.getMessage().getValue()
            });
          } else if (record instanceof APIException) {
            return res.status(400).json({
              success: false,
              error: record.getMessage().getValue(),
              details: record.getDetails()
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Lead ID is required' });
    }

    const recordOperations = new RecordOperations();
    const paramInstance = new ParameterMap();
    const response = await recordOperations.deleteRecords(MODULE_NAME, [id], paramInstance);

    if (response) {
      const responseObject = response.getObject();
      if (responseObject instanceof ActionWrapper) {
        const records = responseObject.getData();
        if (records && records.length > 0) {
          const record = records[0];
          if (record instanceof SuccessResponse) {
            return res.json({
              success: true,
              message: record.getMessage().getValue()
            });
          } else if (record instanceof APIException) {
            return res.status(400).json({
              success: false,
              error: record.getMessage().getValue(),
              details: record.getDetails()
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { createLead, updateLead, deleteLead };
