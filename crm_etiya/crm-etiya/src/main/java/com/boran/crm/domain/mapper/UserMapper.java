package com.boran.crm.domain.mapper;

import com.boran.crm.domain.entity.User;
import com.boran.crm.domain.entity.Role;
import com.boran.crm.domain.web.RegisterRequest;
import com.boran.crm.domain.web.UserResponse;
import com.boran.crm.domain.web.UserListResponse;
import com.boran.crm.domain.web.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.Builder;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, 
        builder = @Builder(disableBuilder = true))
public interface UserMapper {
    
    User registerRequestToUser(RegisterRequest request);

    UserResponse userToUserResponse(User user);

    UserListResponse userToUserListResponse(User user);

    List<UserListResponse> usersToUserListResponses(List<User> users);

    User userUpdateRequestToUser(UserUpdateRequest request);

    @Named("hidePassword")
    default User hidePassword(User user) {
        if (user != null) {
            user.setPassword("***"); // Şifreyi gizle
        }
        return user;
    }
}
