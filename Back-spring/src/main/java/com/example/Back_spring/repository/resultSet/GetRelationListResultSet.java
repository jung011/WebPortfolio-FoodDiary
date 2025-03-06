package com.example.Back_spring.repository.resultSet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetRelationListResultSet {
    String searchWord;
    Long count;
}
