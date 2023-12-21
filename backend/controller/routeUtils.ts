import { Penalty } from "../domain/model/Penalty";
import { User } from "../domain/model/User";
import BlogPostService from "../service/BlogPostService";


const menagePenalties = async(user: User): Promise<Penalty> => {

    const penalties: Penalty[] = await BlogPostService.getPenalties(user.id);
  
    let count = 0;
  
    penalties.forEach(async penalty =>  {
      const currentDate = new Date();
  
      
      const timeDiff = currentDate.getTime() - penalty.startDate.getTime();
      const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
      if(daysPassed > penalty.days) {
        const rmPenalty = await BlogPostService.removePenalty(penalty.id);
        count++;
      }
  
  
    });
  
  
  
    if(penalties.length > 0 && count < penalties.length) {
  
      return penalties[0];
    }
  
    return undefined;
  
  }
  



export const RouteUtils = {
    menagePenalties
}