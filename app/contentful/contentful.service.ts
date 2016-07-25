import { Response } from '@angular/http';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContentfulConfig } from './constans';
import { transformResponse } from './response.tools';
import { ContentfulRequest, SearchItem } from 'ng2-contentful';

/**
 * ContentfulContent works as a replacement for the original ng2-contentful library.
 * It adds next abstraction layer for contenful requests,
 * and any type of custom request and request transformation used in gapminder-org
 * should be implemented here.
 *
 * !! Still in developing !!
 */
export class ContenfulContent {
  private contentful:any;

  public constructor(@Inject('ContentfulService') contentful:any) {
    this.contentful = contentful;
  }

  public getLatestPosts(limit:number):Observable<any[]> {
    return this.getLatestItems(
      this.getRawNodePagesByParams({
        param: 'fields.type',
        value: 'blogpost'
      }), limit
    )
      .map((response:any) => response.items);
  }

  public getPosts(cb: (value: any) => void): void {
    this.getTagBySlug('dollarstreet').subscribe((tag: any) => {
      return this.contentful
        .create()
        .searchEntries(ContentfulConfig.CONTENTFUL_NODE_PAGE_TYPE_ID, {
          param: 'fields.tags.sys.id',
          value: tag.items[0].sys.id
        })
        .include(3)
        .commit()
        .map((response: Response) => transformResponse<any>(response.json(), 2))
        .subscribe(cb);
    });
  }

  /**
   *
   * @param slug
   * @returns {any}
   */
  public getNodePage(slug:string):Observable<any[]> {
    return this.getRawNodePageBySlug(slug)
      .map((response:any) => transformResponse<any>(response));
  }

  private getRawNodePageBySlug(slug:string):Observable<any> {
    return this.contentful
      .create()
      .getEntryBySlug(
        ContentfulConfig.CONTENTFUL_NODE_PAGE_TYPE_ID,
        slug
      )
      .include(2)
      .commit()
      .map((response:Response) => response.json());
  }

  private getLatestItems(request:ContentfulRequest, limit:number, order:string = '-sys.createdAt', include:number = 0):Observable<any> {
    return request
      .limit(limit)
      .order(order)
      .include(include)
      .commit()
      .map((response:Response) => response.json());
  }

  /**
   *
   * @param searchItems
   * @returns {ContentfulRequest}
   */
  private getRawNodePagesByParams(...searchItems:SearchItem[]):ContentfulRequest {
    return this.contentful
      .create()
      .searchEntries(
        ContentfulConfig.CONTENTFUL_NODE_PAGE_TYPE_ID, ...searchItems);
  }

  private getTagBySlug(slug: string): Observable<any> {
    return this.contentful
      .create()
      .getEntryBySlug(
        'tag',
        slug
      )
      .include(2)
      .commit()
      .map((response: Response) => response.json());
  }
}
