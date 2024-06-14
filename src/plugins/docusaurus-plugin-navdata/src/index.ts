import type { LoadContext, Plugin } from '@docusaurus/types';
import {
  AddHeaderInterceptor,
  HttpClient,
  NodeFetcher,
  ContentTypeInterceptor,
} from '@miracledevs/paradigm-web-fetch';
import convertData from './convertData';
import IFooterData from './interfaces/navbar/footerData';
import ISocialMedia from './interfaces/navbar/socialMedia';
//import ISocialMedia from "./interfaces/navbar/socialMedia";

// import imageToBase64 from 'image-to-base64';

type PluginOptions = {
  directusUrl: string;
  directusGraphqlUrl: string;
  directusToken: string;
  query: string;
};

const navDataLoader = (
  _: LoadContext,
  { directusUrl, directusGraphqlUrl, directusToken, query }: PluginOptions
): Plugin<any> => {
  return {
    name: 'docusaurus-plugin-navdata',

    async loadContent() {
      if (!directusToken || !directusUrl || !directusGraphqlUrl || !query) {
        return null;
      }
      const httpClient = new HttpClient();
      var nodeFetcher = new NodeFetcher();
      httpClient.setFetcher(nodeFetcher);
      httpClient.registerInterceptor(
        new ContentTypeInterceptor('application/json')
      );
      httpClient.registerInterceptor(
        new AddHeaderInterceptor('Authorization', `Bearer ${directusToken}`)
      );

      const response = await httpClient.post(
        directusGraphqlUrl,
        undefined,
        JSON.stringify({ query })
      );
      const json = await response.json();
      const data = convertData(json);
      const promises = [];
      for (const navData of data.navTree) {
        promises.push(loadLogos(navData, httpClient, directusUrl));
        for (const socialMedia of navData.social_media) {
          promises.push(
            loadSocialMediaImages(socialMedia, httpClient, directusUrl)
          );
        }
      }

      for (const footerData of data.footerData) {
        promises.push(loadFooterLogos(footerData, httpClient, directusUrl));
        for (const socialMedia of footerData.social_media) {
          promises.push(
            loadSocialMediaImages(socialMedia, httpClient, directusUrl)
          );
        }
      }

      await Promise.all(promises);

      return data;
    },

    async contentLoaded({ content, actions: { setGlobalData } }) {
      setGlobalData(content);
    },
  };
};

const loadSocialMediaImages = async (
  media: ISocialMedia,
  httpClient: HttpClient,
  url: string
) => {
  const response = await httpClient.get(`${url}assets/${media.iconId}`);
  if (response.status != 200) {
    throw new Error(await response.text());
  }
  const text = await response.text();
  media.icon = text;
};

const loadFooterLogos = async (
  footerData: IFooterData,
  httpClient: HttpClient,
  url: string
) => {
  const response = await httpClient.get(`${url}assets/${footerData.logoId}`);
  if (response.status != 200) {
    throw new Error(await response.text());
  }
  const text = await response.text();
  footerData.logo = text;
};

const loadLogos = async (navData: any, httpClient: HttpClient, url: string) => {
  const response = await httpClient.get(`${url}assets/${navData.logo.id}`);
  if (response.status != 200) {
    throw new Error(await response.text());
  }
  const text = await response.text();
  navData.logo = text;
};

export default navDataLoader;
