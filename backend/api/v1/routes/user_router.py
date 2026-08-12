from fastapi import APIRouter, Depends, HTTPException, status

from core.supabase_client import supabase
from api.v1.deps import get_current_user
from schemas.user import UserResponse, UserUpdate, UserStats


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"]
)


# ============================================================
# GET CURRENT USER
# ============================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: dict = Depends(get_current_user)
):
    """Retrieve the current user's profile."""
    auth_user_id = current_user["sub"]

    try:
        response = (
            supabase
            .table("users")
            .select("*")
            .eq("auth_user_id", auth_user_id)
            .single()
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        return response.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving user profile: {str(e)}"
        )


# ============================================================
# UPDATE CURRENT USER
# ============================================================

@router.patch(
    "/me",
    response_model=UserResponse
)
def update_me(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update the current user's profile details."""
    auth_user_id = current_user["sub"]

    update_data = user_data.model_dump(
        exclude_unset=True,
        exclude_none=True
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update"
        )

    try:
        response = (
            supabase
            .table("users")
            .update(update_data)
            .eq("auth_user_id", auth_user_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user profile: {str(e)}"
        )


# ============================================================
# GET USER STATISTICS
# ============================================================

@router.get(
    "/me/stats",
    response_model=UserStats
)
def get_my_stats(
    current_user: dict = Depends(get_current_user)
):
    """Retrieve statistics for the current user (startups, analyses, reports, pitch decks)."""
    auth_user_id = current_user["sub"]

    try:
        # Find application user record
        user_response = (
            supabase
            .table("users")
            .select("id")
            .eq("auth_user_id", auth_user_id)
            .single()
            .execute()
        )

        if not user_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

        user_id = user_response.data["id"]

        # Total startups owned by user
        startup_response = (
            supabase
            .table("startups")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .execute()
        )

        total_startups = startup_response.count or 0
        startup_ids = [s["id"] for s in (startup_response.data or [])]

        completed_analysis = 0
        reports_generated = 0
        pitch_decks_generated = 0

        if startup_ids:
            # Completed analyses across user's startups
            analysis_response = (
                supabase
                .table("analyses")
                .select("id", count="exact")
                .in_("startup_id", startup_ids)
                .eq("status", "completed")
                .execute()
            )
            completed_analysis = analysis_response.count or 0

            # Reports generated across user's startups
            report_response = (
                supabase
                .table("reports")
                .select("id", count="exact")
                .in_("startup_id", startup_ids)
                .execute()
            )
            reports_generated = report_response.count or 0

            # Pitch decks generated across user's startups
            pitch_response = (
                supabase
                .table("pitch_decks")
                .select("id", count="exact")
                .in_("startup_id", startup_ids)
                .execute()
            )
            pitch_decks_generated = pitch_response.count or 0

        return {
            "total_startups": total_startups,
            "completed_analysis": completed_analysis,
            "reports_generated": reports_generated,
            "pitch_decks_generated": pitch_decks_generated
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating user statistics: {str(e)}"
        )