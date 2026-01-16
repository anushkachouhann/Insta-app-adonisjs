import type { HttpContext } from '@adonisjs/core/http'
import { ShareService } from '#services/share_service'

export default class SharesController {
    private shareService = new ShareService();

    public async share({ request, response }: HttpContext){
        try {
            const { userId, postId } = request.only(['userId', 'postId']);
            const share = await this.shareService.sharePost(userId, postId);
            return response.status(201).json(share);
        } catch (error: any) {
            return response.status(400).json({ error: error.message });
        }
    }

    public async getPostShares({ params, response }: HttpContext){
        try {
            const shares = await this.shareService.getSharesByPostId(params.postId);
            return response.json(shares);
        } catch (error: any) {
            return response.status(500).json({ error: error.message });
        }
    }

    public async getShareCount({ params, response }: HttpContext){
        try {
            const count = await this.shareService.getShareCount(params.postId);
            return response.json({ count });
        } catch (error: any) {
            return response.status(500).json({ error: error.message });
        }
    }
}
