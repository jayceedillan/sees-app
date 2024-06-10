import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HtmlStyleService {
  public getBoxShadowStyle(color: string): {
    'box-shadow': string;
  } {
    return {
      'box-shadow': `5px 5px 5px 0px ${color}`,
    };
  }
}
