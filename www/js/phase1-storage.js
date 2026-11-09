/* ODDIRO Phase 1: non-destructive versioned local save. */
(function(global){
  'use strict';
  const OLD_KEY = 'oddiro_save_v1';
  const NEW_KEY = 'oddiro_save_v2';
  const BACKUP_KEY = 'oddiro_save_v2_backup';
  const hasOwn = (o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const finiteInt = (v, fallback, minimum=0) => Number.isSafeInteger(v) && v>=minimum ? v : fallback;
  function defaults(){
    return {
      schemaVersion:2, best:0, points:0, maxUnlockedStage:1,
      inv:{halfHint:0,clarify:0,retry:0,reveal:0},
      progress:{totalXp:0,equippedTitle:null,unlockedTitles:[],unlockedAchievements:[],rewardedRanks:[]},
      timeAttack:{bestScore:0,totalGames:0,totalCorrect:0,bestCombo:0},
      daily:{history:{},currentStreak:0,longestStreak:0,totalDays:0,perfectDays:0},
      cosmetics:{equippedTile:'square',equippedTheme:'dark',equippedEffect:'default',unlockedTiles:['square'],unlockedThemes:['dark'],unlockedEffects:['default']},
      stats:{totalGames:0,totalCorrect:0,totalWrong:0,totalPlaySeconds:0,totalItemsUsed:0,classicCorrect:0},
      settings:{sound:true,haptics:true,reducedMotion:false,confirmExit:true},
      activeSession:null, rewardHistory:{}, migration:{source:null,completedAt:null}
    };
  }
  function read(key){ const raw=localStorage.getItem(key); if(!raw) return null; const parsed=JSON.parse(raw); if(!parsed || typeof parsed!=='object'||Array.isArray(parsed)) throw Error('Invalid save'); return parsed; }
  function normalize(obj, fromOld){
    const result=defaults();
    result.best=finiteInt(obj.best,0);
    result.points=finiteInt(obj.points,0);
    result.maxUnlockedStage=finiteInt(obj.maxUnlockedStage,1,1);
    for(const k of Object.keys(result.inv)) result.inv[k]=finiteInt(obj.inv?.[k],0);
    if(!fromOld){
      for(const section of ['progress','timeAttack','daily','cosmetics','stats','settings','rewardHistory','migration']){
        if(obj[section] && typeof obj[section]==='object' && !Array.isArray(obj[section])) result[section]={...result[section],...obj[section]};
      }
      if(obj.activeSession && typeof obj.activeSession==='object') result.activeSession=obj.activeSession;
    }else{
      result.migration={source:OLD_KEY,completedAt:new Date().toISOString()};
      // Only milestone facts that can be inferred from the old best score.
      for(const [stage,title] of [[1,'first_play'],[10,'classic_10'],[30,'classic_30'],[50,'classic_50'],[100,'classic_100'],[200,'classic_200']]){
        if(result.best >= stage) result.progress.unlockedTitles.push(title);
      }
      // Retroactive achievement rewards are reserved for the progression phase.
    }
    result.schemaVersion=2;
    return result;
  }
  function load(){
    for(const key of [NEW_KEY,BACKUP_KEY]){
      try{const data=read(key);if(data && data.schemaVersion===2)return normalize(data,false);}catch(err){console.warn('ODDIRO saved data unreadable:',key,err);}
    }
    try{
      const old=read(OLD_KEY);
      if(old){
        const migrated=normalize(old,true);
        if(!persist(migrated))throw Error('Migration write failed');
        return migrated;
      }
    }catch(err){console.error('ODDIRO migration not completed:',err);throw err;}
    return defaults();
  }
  function persist(data){
    try{
      const payload=JSON.stringify(data);
      const previous=localStorage.getItem(NEW_KEY);
      if(previous){
        try{const old=JSON.parse(previous);if(old && old.schemaVersion===2)localStorage.setItem(BACKUP_KEY,previous);}catch(_ignored){}
      }
      localStorage.setItem(NEW_KEY,payload);
      if(localStorage.getItem(NEW_KEY)!==payload)throw Error('Save verification failed');
      return true;
    }catch(err){console.error('ODDIRO save failed:',err);return false;}
  }
  global.OddiroStorage={load,persist,NEW_KEY,OLD_KEY};
})(window);
