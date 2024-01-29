import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmDataService {

  apiurl = environment.baseUrl_AssetManagement;
  alarmApiUrl = environment.baseUrl_AlarmManagement;

  constructor(private http: HttpClient) {
  }

  getAssetList(organizationId: number): Observable<any[]> {
    let userId = sessionStorage.getItem("userId");
    return this.http.get<any[]>(this.apiurl + 'assetsByOrganiztionId/' + organizationId + "?user-id=" + userId);
  }
  getAlarmTypesForDiscrete() {
    return this.http.get<any[]>(this.alarmApiUrl + 'discreteAlarmTypes')
  }

  getAlarmStates() {
    return this.http.get<any[]>(this.alarmApiUrl + 'alarmStates')
  }

  getAlarmSeveritys() {
    return this.http.get<any[]>(this.alarmApiUrl + 'alarmSeveritys')
  }

  getAlarmTypes() {
    return this.http.get<any[]>(this.alarmApiUrl + 'alarm-types')
  }

  getAlarmDataByBusinessEntityId(beId: number, zoneId: string) {
    return this.http.get<any[]>(this.alarmApiUrl + 'organization/' + beId + '/alarms?targetTimeZone=' + zoneId)
  }

  getAlarmDataByBeIdTimeZoneAndSearchFeilds(beId: number, zoneId: string, alarmStartDate: number, alarmEndDate: number, assetId: string, alarmSeverity: string, alarmState: string, userId: number) {
    let url = 'alarm/events?beId=' + beId + '&targetTimeZone=' + zoneId + '&user-id=' + userId;
    if (null != alarmStartDate) {
      url = url + "&alarmStartDate=" + alarmStartDate;
    } else {
      url = url + "&alarmStartDate=";
    }
    if (null != alarmEndDate) {
      url = url + "&alarmEndDate=" + alarmEndDate;
    } else {
      url = url + "&alarmEndDate=";
    }
    if (null != assetId) {
      url = url + "&assetId=" + assetId;
    } else {
      url = url + "&assetId=";
    }
    if (null != alarmSeverity) {
      url = url + "&alarmSeverity=" + alarmSeverity;
    } else {
      url = url + "&alarmSeverity=";
    }
    if (null != alarmState) {
      url = url + "&alarmState=" + alarmState;
    } else {
      url = url + "&alarmState=";
    }
    return this.http.get<any[]>(this.alarmApiUrl + url)
  }

  saveAlarmEvent(alarmEvent: any) {
    return this.http.post<any>(this.alarmApiUrl + 'alarm-event', alarmEvent);
  }

  getAssetTagsByAssetIds(assetIds) {
    return this.http.get<any[]>(this.apiurl + 'assetTags/' + assetIds);
  }

  getIncrementalAlarmData(beId: number, zoneId: string, latestTime: number, userId: number) {
    let url = 'organization/' + beId + '/alarms?targetTimeZone=' + zoneId + '&user-id=' + userId
    if (null != latestTime) {
      url = url + "&latestTime=" + latestTime;
    } else {
      url = url + "&latestTime=";
    }
    return this.http.get<any[]>(this.alarmApiUrl + url)
  }

  getEnggUnits(): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl_gatewayManagement + 'getEnggUnits');
  }

  getTimeIntervalsFromFile(): Observable<any> {
    return this.http.get<any>('/assets/json/timeInterval.json');
  }

  getAlarmCount(beId: number, zoneId: string, latestTime: number, userId: number,userType:String) {
    let url = 'organizations/' + beId + '/alarms/count?target-time-zone=' + zoneId + '&user-id=' + userId+'&user-type='+userType
    if (null != latestTime) {
      url = url + "&latest-time=" + latestTime;
    } else {
      url = url + "&latest-time=";
    }
    return this.http.get<any>(this.alarmApiUrl+url)
  }
}
