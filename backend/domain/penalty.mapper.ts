import { BlogCommentPrisma, BlogPostPrisma, UserPrisma, PenaltyPrisma } from "../types/prismatypes";
import { mapToPosts } from "./blogPost.mapper";
import { mapToComments } from "./comment.mapper";
import { Penalty } from "./model/Penalty";
import { User } from "./model/User";
import { mapToUser } from "./user.mapper";

export const mapToPenalty = (penalty: PenaltyPrisma & {user: UserPrisma}): Penalty =>{
    if(penalty === undefined) return undefined;
    const startDate = new Date(penalty.startDate);
    
    return new Penalty({id: penalty.id,description: penalty.description, days: penalty.days, userId: penalty.userId, startDate: startDate});
}
    

export const mapToPenalties = (penaltiesPrisma: PenaltyPrisma[]): Penalty[] => {

    if (penaltiesPrisma && penaltiesPrisma.length > 0) {
        return penaltiesPrisma.map(mapToPenalty);
    }
    return []
}

