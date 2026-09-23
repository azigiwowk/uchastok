'use strict';
// Run BEFORE legacy readers. Original bytes survive even a partially understood schema.
BernV6.legacyRaw={};
if(!V6_REVIEW){try{
 const keys=['bern_layout_v1','bern_layout_v2','bern_layout_variants','bern_layout_variants_v2','bern_catalog_v1','bern_catalog_v2','bern_project_state_v2','bern_project_backups_v2','bern_project_v6','bern_ui_v6'];
 for(const key of keys){const raw=localStorage.getItem(key);if(raw!=null){BernV6.legacyRaw[key]=raw;JSON.parse(raw);}}
 const v6=BernV6.legacyRaw.bern_project_v6&&JSON.parse(BernV6.legacyRaw.bern_project_v6);
 if(v6&&(v6.schemaVersion!==6||!v6.project||!v6.scene))throw Error('Неизвестная или повреждённая схема проекта');
 if(!localStorage.getItem('bern_pre_v6_backup')&&Object.keys(BernV6.legacyRaw).length)localStorage.setItem('bern_pre_v6_backup',JSON.stringify({createdAt:new Date().toISOString(),raw:BernV6.legacyRaw}));
 for(const [oldKey,newKey] of [['bern_layout_v1','bern_layout_v2'],['bern_layout_variants','bern_layout_variants_v2'],['bern_catalog_v1','bern_catalog_v2']])if(!localStorage.getItem(newKey)&&localStorage.getItem(oldKey))localStorage.setItem(newKey,localStorage.getItem(oldKey));
}catch(e){BernV6.readOnly=true;BernV6.storageError='Миграция остановлена: '+e.message+'. Исходные данные не перезаписываются. Скачайте исходные сохранения в разделе Проект.';}}
