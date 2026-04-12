import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Wallet, Retiro, SolicitarRetiroRequest } from '../models/Wallet';

@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWallet(id_empresa: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.base}/wallet/${id_empresa}`);
  }

  getRetiros(id_empresa: number): Observable<Retiro[]> {
    return this.http.get<Retiro[]>(`${this.base}/wallet/${id_empresa}/retiros`);
  }

  solicitarRetiro(data: SolicitarRetiroRequest): Observable<Retiro> {
    return this.http.post<Retiro>(`${this.base}/wallet/retiro`, data);
  }
}
